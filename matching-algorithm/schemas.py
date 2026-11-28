"""Pydantic schemas for the name similarity API."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

MAX_NAME_LENGTH = 1_000

RomanisationVariantKind = Literal[
    "mock-reference",
    "spelling-candidate",
    "spacing-candidate",
    "name-order-candidate",
]

CompareMethod = Literal["levenshtein", "dictionary-assisted", "unavailable"]


class RomanisationVariantSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")

    latin: str
    kind: RomanisationVariantKind
    note: str


class RomanisationDictionaryEntrySchema(BaseModel):
    model_config = ConfigDict(extra="forbid")

    khmer: str
    variants: list[RomanisationVariantSchema]


class CompareRequest(BaseModel):
    """Request body for name comparison.

    Empty strings are accepted for compatibility; the service returns
    score=null with an explanatory message when either name is empty after
    normalization.
    """

    model_config = ConfigDict(extra="forbid")

    firstName: str = Field(
        ...,
        max_length=MAX_NAME_LENGTH,
        description="First name to compare (Khmer, Latin, or mixed script).",
        examples=["សុខ ដារ៉ា"],
    )
    secondName: str = Field(
        ...,
        max_length=MAX_NAME_LENGTH,
        description="Second name to compare against firstName.",
        examples=["Sokh Dara"],
    )


class CompareResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    score: int | None = Field(
        None,
        ge=0,
        le=100,
        description="Similarity score 0-100, or null when comparison is unavailable.",
    )
    explanation: str = Field(..., description="Human-readable explanation of the result.")
    distance: int | None = Field(None, ge=0, description="Levenshtein edit distance.")
    maxLength: int | None = Field(
        None, ge=0, description="Compared length used for score calculation."
    )
    method: CompareMethod = Field(
        ..., description="Comparison method: levenshtein, dictionary-assisted, or unavailable."
    )
    matchedVariant: str | None = Field(
        None, description="Best matched Latin variant for dictionary-assisted comparisons."
    )
    variantType: RomanisationVariantKind | None = Field(
        None, description="Kind of matched romanisation variant."
    )
    dictionaryEntry: RomanisationDictionaryEntrySchema | None = Field(
        None, description="Dictionary entry used for cross-script comparison."
    )


class HealthResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    status: Literal["ok"]


class ErrorResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    error: str = Field(..., description="Error message.", examples=["Invalid request body"])
