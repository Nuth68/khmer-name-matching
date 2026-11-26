export type RomanisationVariantKind =
  | "mock-reference"
  | "spelling-candidate"
  | "spacing-candidate"
  | "name-order-candidate";

export interface RomanisationVariant {
  latin: string;
  kind: RomanisationVariantKind;
  note: string;
}

export interface RomanisationDictionaryEntry {
  khmer: string;
  variants: RomanisationVariant[];
}

export interface NameSimilarityResult {
  score: number | null;
  explanation: string;
  distance: number | null;
  maxLength: number | null;
  method: "levenshtein" | "dictionary-assisted" | "unavailable";
  matchedVariant: string | null;
  variantType: RomanisationVariantKind | null;
  dictionaryEntry: RomanisationDictionaryEntry | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isVariant(value: unknown): value is RomanisationVariant {
  return (
    isRecord(value) &&
    typeof value.latin === "string" &&
    typeof value.note === "string" &&
    (value.kind === "mock-reference" ||
      value.kind === "spelling-candidate" ||
      value.kind === "spacing-candidate" ||
      value.kind === "name-order-candidate")
  );
}

function isDictionaryEntry(
  value: unknown,
): value is RomanisationDictionaryEntry {
  return (
    isRecord(value) &&
    typeof value.khmer === "string" &&
    Array.isArray(value.variants) &&
    value.variants.every(isVariant)
  );
}

function isNameSimilarityResult(
  value: unknown,
): value is NameSimilarityResult {
  return (
    isRecord(value) &&
    (value.score === null ||
      (typeof value.score === "number" &&
        Number.isInteger(value.score) &&
        value.score >= 0 &&
        value.score <= 100)) &&
    typeof value.explanation === "string" &&
    (value.distance === null ||
      (typeof value.distance === "number" &&
        Number.isInteger(value.distance) &&
        value.distance >= 0)) &&
    (value.maxLength === null ||
      (typeof value.maxLength === "number" &&
        Number.isInteger(value.maxLength) &&
        value.maxLength >= 0)) &&
    (value.method === "levenshtein" ||
      value.method === "dictionary-assisted" ||
      value.method === "unavailable") &&
    (value.matchedVariant === null ||
      typeof value.matchedVariant === "string") &&
    (value.variantType === null ||
      value.variantType === "mock-reference" ||
      value.variantType === "spelling-candidate" ||
      value.variantType === "spacing-candidate" ||
      value.variantType === "name-order-candidate") &&
    (value.dictionaryEntry === null ||
      isDictionaryEntry(value.dictionaryEntry))
  );
}

export async function compareNames(
  firstName: string,
  secondName: string,
  signal?: AbortSignal,
): Promise<NameSimilarityResult> {
  const response = await fetch("/api/compare", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName, secondName }),
    signal,
  });

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error("The similarity API returned an invalid response.");
  }

  if (!response.ok) {
    const message =
      isRecord(payload) && typeof payload.error === "string"
        ? payload.error
        : `Similarity API request failed (${response.status}).`;
    throw new Error(message);
  }

  if (!isNameSimilarityResult(payload)) {
    throw new Error("The similarity API response has an unexpected format.");
  }

  return payload;
}
