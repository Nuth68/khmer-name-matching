"""Dependency-free Khmer/Latin name similarity demo.

Same-script names use normalized Levenshtein similarity. Cross-script scores
are only available when the Khmer name exactly matches a reviewed dictionary
entry; the included variants are illustrative and are not identity evidence.
Short edits can produce high scores for different people, and valid spellings
missing from the small dictionary cannot be scored across scripts.
"""

from __future__ import annotations

import argparse
import json
import math
import unicodedata
from dataclasses import asdict, dataclass
from typing import Optional


@dataclass(frozen=True)
class RomanisationVariant:
    latin: str
    kind: str
    note: str


@dataclass(frozen=True)
class KhmerRomanisationEntry:
    khmer: str
    variants: tuple[RomanisationVariant, ...]


@dataclass(frozen=True)
class SimilarityResult:
    score: Optional[int]
    explanation: str
    edit_distance: Optional[int]
    compared_length: Optional[int]
    method: str
    matched_variant: Optional[str] = None
    variant_type: Optional[str] = None
    dictionary_entry: Optional[KhmerRomanisationEntry] = None


KHMER_VARIANTS: dict[str, KhmerRomanisationEntry] = {
    "សុខ ដារ៉ា": KhmerRomanisationEntry(
        khmer="សុខ ដារ៉ា",
        variants=(
            RomanisationVariant(
                "Sok Dara",
                "mock-reference",
                "Existing demo reference spelling; verify against the source record.",
            ),
            RomanisationVariant(
                "Sokh Dara",
                "spelling-candidate",
                "Existing demo candidate; the final ខ may be represented as kh. Confirm identity before matching.",
            ),
            RomanisationVariant(
                "Sok Darra",
                "spelling-candidate",
                "Existing demo candidate with doubled r; this spelling is not determined by the Khmer text.",
            ),
            RomanisationVariant(
                "Dara Sok",
                "name-order-candidate",
                "Existing demo order variant; review local name order before treating it as an alias.",
            ),
        ),
    ),
    "លី ស្រីពេជ្រ": KhmerRomanisationEntry(
        khmer="លី ស្រីពេជ្រ",
        variants=(
            RomanisationVariant(
                "Ly Sreypich",
                "mock-reference",
                "Existing mock-record spelling; verify against the source record.",
            ),
            RomanisationVariant(
                "Li Sreypich",
                "spelling-candidate",
                "Candidate Latin spelling for លី; confirm that it refers to the same person.",
            ),
            RomanisationVariant(
                "Ly Srey Pich",
                "spacing-candidate",
                "Candidate word-boundary variation; Khmer text does not mark this Latin spacing.",
            ),
        ),
    ),
    "ចាន់ សុភា": KhmerRomanisationEntry(
        khmer="ចាន់ សុភា",
        variants=(
            RomanisationVariant(
                "Chan Sophea",
                "mock-reference",
                "Existing mock-record spelling; verify against the source record.",
            ),
            RomanisationVariant(
                "Chann Sophea",
                "spelling-candidate",
                "Candidate doubled-n spelling for ចាន់; confirm with a trusted record before matching.",
            ),
        ),
    ),
}


def normalize_name(value: str) -> str:
    """Apply NFC, trim/collapse whitespace, and case-fold Latin text."""
    return " ".join(unicodedata.normalize("NFC", value).split()).casefold()


def contains_khmer(value: str) -> bool:
    return any(
        unicodedata.name(character, "").startswith("KHMER ")
        for character in value
    )


def levenshtein_distance(left: str, right: str) -> int:
    """Return Levenshtein distance over Unicode code points."""
    left_points = list(left)
    right_points = list(right)

    if len(left_points) < len(right_points):
        left_points, right_points = right_points, left_points

    previous_row = list(range(len(right_points) + 1))
    for left_index, left_character in enumerate(left_points, start=1):
        current_row = [left_index]
        for right_index, right_character in enumerate(right_points, start=1):
            current_row.append(
                min(
                    current_row[right_index - 1] + 1,
                    previous_row[right_index] + 1,
                    previous_row[right_index - 1]
                    + (left_character != right_character),
                )
            )
        previous_row = current_row

    return previous_row[-1]


def _score_pair(
    left: str,
    right: str,
    method: str,
    matched_variant: Optional[str] = None,
    variant_type: Optional[str] = None,
    dictionary_entry: Optional[KhmerRomanisationEntry] = None,
) -> SimilarityResult:
    distance = levenshtein_distance(left, right)
    compared_length = max(len(left), len(right))
    score = math.floor(
        ((compared_length - distance) / compared_length) * 100 + 0.5
    )
    explanation = (
        f"Levenshtein distance is {distance} edit(s) over "
        f"{compared_length} Unicode code points; similarity is {score}%."
    )
    if matched_variant is not None and variant_type is not None:
        explanation = (
            f'Best dictionary match: "{matched_variant}" ({variant_type}). '
            f"{explanation} Verify this candidate against a trusted record. "
            "Similarity alone does not establish identity."
        )
    else:
        explanation += (
            " This is character similarity, not phonetic similarity or "
            "evidence of identity."
        )

    return SimilarityResult(
        score=score,
        explanation=explanation,
        edit_distance=distance,
        compared_length=compared_length,
        method=method,
        matched_variant=matched_variant,
        variant_type=variant_type,
        dictionary_entry=dictionary_entry,
    )


def compare_names(first: str, second: str) -> SimilarityResult:
    """Compare two names and return a baseline score plus its explanation.

    Empty input and unknown Khmer/Latin pairs return ``score=None`` rather
    than a misleading cross-script score.
    """
    left = normalize_name(first)
    right = normalize_name(second)

    if not left or not right:
        return SimilarityResult(
            score=None,
            explanation="Enter both names to calculate a similarity score.",
            edit_distance=None,
            compared_length=None,
            method="unavailable",
        )

    left_is_khmer = contains_khmer(left)
    right_is_khmer = contains_khmer(right)

    if left_is_khmer != right_is_khmer:
        khmer_name, latin_name = (
            (left, right) if left_is_khmer else (right, left)
        )
        dictionary_entry = next(
            (
                entry
                for name, entry in KHMER_VARIANTS.items()
                if normalize_name(name) == khmer_name
            ),
            None,
        )

        if dictionary_entry is None:
            return SimilarityResult(
                score=None,
                explanation=(
                    "No score available: the Khmer name has no exact entry "
                    "in this demo dictionary. Add a reviewed romanisation "
                    "candidate before comparing across scripts."
                ),
                edit_distance=None,
                compared_length=None,
                method="unavailable",
            )

        candidates = [
            _score_pair(
                normalize_name(variant.latin),
                latin_name,
                method="dictionary-assisted Levenshtein",
                matched_variant=variant.latin,
                variant_type=variant.kind,
                dictionary_entry=dictionary_entry,
            )
            for variant in dictionary_entry.variants
        ]
        return max(candidates, key=lambda result: result.score or 0)

    return _score_pair(left, right, method="Levenshtein")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Compare two names with a simple, explainable baseline."
    )
    parser.add_argument("first_name", help="First name (Khmer or Latin)")
    parser.add_argument("second_name", help="Second name (Khmer or Latin)")
    args = parser.parse_args()

    result = compare_names(args.first_name, args.second_name)
    print(json.dumps(asdict(result), ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
