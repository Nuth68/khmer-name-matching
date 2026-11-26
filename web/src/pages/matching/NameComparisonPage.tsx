import { useMemo, useState } from "react";
import {
  ArrowLeftRight,
  Eraser,
  GitCompareArrows,
  Info,
  Languages,
} from "lucide-react";
import { ProgressBarHalfCircle } from "@/components/base/progress-indicators/progress-circles";
import PageHeader from "../../components/common/PageHeader";

export type ScriptType = "Khmer" | "Latin" | "Mixed" | "Unknown";
type DetectionValue = "Detected" | "Not detected" | "Possible" | "Not evaluated";

interface RomanisationResult {
  value: string;
  fullyKnown: boolean;
}

interface ComparisonResult {
  inputA: string;
  inputB: string;
  scriptA: ScriptType;
  scriptB: ScriptType;
  normalizedA: string;
  normalizedB: string;
  romanisedA: string | null;
  romanisedB: string | null;
  score: number;
  status: "High Similarity" | "Moderate Similarity" | "Low Similarity";
  comparisonType: string;
  writingSystem: string;
  exactInputMatch: boolean;
  normalizedMatch: boolean;
  romanisationVariant: DetectionValue;
  typingError: DetectionValue;
  nameOrderDifference: DetectionValue;
  formattingDifference: DetectionValue;
  partialName: DetectionValue;
  phoneticSimilarity: "Not evaluated";
  characterSimilarity: number;
  tokenSimilarity: number;
  romanisationSimilarity: number | null;
  explanation: string;
}

const KHMER_PATTERN = /[\u1780-\u17ff]/;
const LATIN_PATTERN = /[a-z]/i;

const ROMANISATION_DICTIONARY: Record<string, { canonical: string; variants: string[] }> = {
  "សុខ": { canonical: "sok", variants: ["sok", "sokh"] },
  "សុក": { canonical: "sok", variants: ["sok", "sokh"] },
  "ដារ៉ា": { canonical: "dara", variants: ["dara", "darah", "darra"] },
  "ដារា": { canonical: "dara", variants: ["dara", "darah", "darra"] },
  "ចាន់": { canonical: "chan", variants: ["chan", "chann"] },
  "សុភា": { canonical: "sophea", variants: ["sophea", "sopha"] },
  "រតនា": { canonical: "rattana", variants: ["rattana", "rathana", "rotana"] },
  "សីហា": { canonical: "seyha", variants: ["seyha", "seiha", "sayha"] },
  "នូ": { canonical: "nu", variants: ["nu", "nou", "noo"] },
  "វិសាល": { canonical: "visal", variants: ["visal", "visall"] },
};

export function detectScriptType(value: string): ScriptType {
  const hasKhmer = KHMER_PATTERN.test(value);
  const hasLatin = LATIN_PATTERN.test(value);

  if (hasKhmer && hasLatin) return "Mixed";
  if (hasKhmer) return "Khmer";
  if (hasLatin) return "Latin";
  return "Unknown";
}

export function normalizeName(value: string): string {
  return value.normalize("NFKC").trim().replace(/\s+/gu, " ").toLocaleLowerCase("en");
}

function splitTokens(value: string): string[] {
  return value ? value.split(" ").filter(Boolean) : [];
}

function romaniseKnownKhmer(value: string): RomanisationResult {
  const tokens = splitTokens(normalizeName(value));
  let fullyKnown = tokens.length > 0;
  const romanised = tokens.map((token) => {
    const entry = ROMANISATION_DICTIONARY[token];
    if (!entry) {
      fullyKnown = false;
      return token;
    }
    return entry.canonical;
  });

  return { value: romanised.join(" "), fullyKnown };
}

function canonicalizeKnownLatin(value: string): string {
  return splitTokens(normalizeName(value))
    .map((token) => {
      const entry = Object.values(ROMANISATION_DICTIONARY).find((candidate) =>
        candidate.variants.includes(token),
      );
      return entry?.canonical ?? token;
    })
    .join(" ");
}

export function levenshteinDistance(firstValue: string, secondValue: string): number {
  const first = Array.from(firstValue);
  const second = Array.from(secondValue);
  const previous = Array.from({ length: second.length + 1 }, (_, index) => index);

  for (let row = 1; row <= first.length; row += 1) {
    let diagonal = previous[0];
    previous[0] = row;

    for (let column = 1; column <= second.length; column += 1) {
      const saved = previous[column];
      previous[column] = Math.min(
        previous[column] + 1,
        previous[column - 1] + 1,
        diagonal + (first[row - 1] === second[column - 1] ? 0 : 1),
      );
      diagonal = saved;
    }
  }

  return previous[second.length];
}

function stringSimilarity(first: string, second: string): number {
  const longestLength = Math.max(Array.from(first).length, Array.from(second).length);
  if (longestLength === 0) return 100;
  return Math.max(
    0,
    Math.round((1 - levenshteinDistance(first, second) / longestLength) * 100),
  );
}

function tokenSimilarity(firstValue: string, secondValue: string): number {
  const firstTokens = splitTokens(firstValue);
  const secondTokens = splitTokens(secondValue);
  if (!firstTokens.length && !secondTokens.length) return 100;
  if (!firstTokens.length || !secondTokens.length) return 0;

  const source = firstTokens.length <= secondTokens.length ? firstTokens : secondTokens;
  const available = [...(firstTokens.length <= secondTokens.length ? secondTokens : firstTokens)];
  let total = 0;

  source.forEach((token) => {
    let bestScore = -1;
    let bestIndex = 0;
    available.forEach((candidate, index) => {
      const candidateScore = stringSimilarity(token, candidate);
      if (candidateScore > bestScore) {
        bestScore = candidateScore;
        bestIndex = index;
      }
    });
    total += Math.max(0, bestScore);
    available.splice(bestIndex, 1);
  });

  return Math.round(total / Math.max(firstTokens.length, secondTokens.length));
}

function sortedTokenKey(value: string): string {
  return splitTokens(value).sort((a, b) => a.localeCompare(b)).join("\u0000");
}

function hasSameTokensInDifferentOrder(first: string, second: string): boolean {
  const firstTokens = splitTokens(first);
  const secondTokens = splitTokens(second);
  return (
    firstTokens.length > 1 &&
    firstTokens.length === secondTokens.length &&
    first !== second &&
    sortedTokenKey(first) === sortedTokenKey(second)
  );
}

function containsAllTokens(container: string[], subset: string[]): boolean {
  const remaining = [...container];
  return subset.every((token) => {
    const index = remaining.indexOf(token);
    if (index === -1) return false;
    remaining.splice(index, 1);
    return true;
  });
}

function hasMissingNamePart(first: string, second: string): boolean {
  const firstTokens = splitTokens(first);
  const secondTokens = splitTokens(second);
  if (firstTokens.length === secondTokens.length || !firstTokens.length || !secondTokens.length) {
    return false;
  }
  const longer = firstTokens.length > secondTokens.length ? firstTokens : secondTokens;
  const shorter = firstTokens.length > secondTokens.length ? secondTokens : firstTokens;
  return containsAllTokens(longer, shorter);
}

function isCrossScript(scriptA: ScriptType, scriptB: ScriptType): boolean {
  return (
    (scriptA === "Khmer" && scriptB === "Latin") ||
    (scriptA === "Latin" && scriptB === "Khmer")
  );
}

function similarityStatus(score: number): ComparisonResult["status"] {
  if (score >= 85) return "High Similarity";
  if (score >= 60) return "Moderate Similarity";
  return "Low Similarity";
}

function comparisonTypeFor(
  scriptA: ScriptType,
  scriptB: ScriptType,
  exact: boolean,
  formattingDifference: boolean,
  orderDifference: boolean,
  partialName: boolean,
): string {
  if (exact) return "Exact Match";
  if (formattingDifference) return "Formatting Difference";
  if (orderDifference) return "Name Order Difference";
  if (partialName) return "Missing or Extra Name Parts";
  if (scriptA === "Khmer" && scriptB === "Khmer") return "Khmer–Khmer Similarity";
  if (scriptA === "Latin" && scriptB === "Latin") return "Latin–Latin Similarity";
  if (isCrossScript(scriptA, scriptB)) return "Khmer–Latin Similarity";
  return "Mixed-script Comparison";
}

function buildExplanation(result: Omit<ComparisonResult, "explanation">): string {
  const sentences: string[] = [];

  if (isCrossScript(result.scriptA, result.scriptB)) {
    sentences.push("The names use different writing systems.");
  } else {
    sentences.push(`Both names are written using ${result.scriptA.toLowerCase()} script.`);
  }

  if (result.exactInputMatch) {
    sentences.push("The original inputs are exactly the same.");
  } else if (result.formattingDifference === "Detected") {
    sentences.push("Capitalization or whitespace differs, but ordinary text normalization matches.");
  }

  if (result.romanisationVariant === "Possible") {
    sentences.push(
      "The Khmer name has a known dictionary romanisation variant matching the Latin name.",
    );
  }
  if (result.nameOrderDifference === "Detected") {
    sentences.push("The same name parts appear in a different order.");
  }
  if (result.partialName === "Detected") {
    sentences.push("One input is missing a name part that appears in the other input.");
  }
  if (result.typingError === "Possible") {
    sentences.push("A small Latin edit distance indicates a possible typing or spelling variation.");
  }

  sentences.push("Phonetic similarity was not evaluated in this prototype.");
  sentences.push(
    "The names may be similar, but this result does not confirm that they belong to the same person.",
  );
  return sentences.join(" ");
}

export function compareNames(inputA: string, inputB: string): ComparisonResult {
  const scriptA = detectScriptType(inputA);
  const scriptB = detectScriptType(inputB);
  const normalizedA = normalizeName(inputA);
  const normalizedB = normalizeName(inputB);
  const exactInputMatch = inputA === inputB && inputA.length > 0;
  const normalizedMatch = normalizedA === normalizedB && normalizedA.length > 0;
  const crossScript = isCrossScript(scriptA, scriptB);

  const khmerInput = scriptA === "Khmer" ? inputA : scriptB === "Khmer" ? inputB : null;
  const latinInput = scriptA === "Latin" ? inputA : scriptB === "Latin" ? inputB : null;
  const khmerRomanisation = khmerInput ? romaniseKnownKhmer(khmerInput) : null;
  const canonicalLatin = latinInput ? canonicalizeKnownLatin(latinInput) : null;
  const romanisationEvaluated = Boolean(
    crossScript && khmerRomanisation?.fullyKnown && canonicalLatin,
  );

  const comparableA =
    scriptA === "Khmer" && romanisationEvaluated
      ? khmerRomanisation?.value ?? normalizedA
      : scriptA === "Latin" && romanisationEvaluated
        ? canonicalizeKnownLatin(inputA)
        : normalizedA;
  const comparableB =
    scriptB === "Khmer" && romanisationEvaluated
      ? khmerRomanisation?.value ?? normalizedB
      : scriptB === "Latin" && romanisationEvaluated
        ? canonicalizeKnownLatin(inputB)
        : normalizedB;

  const characterSimilarity = stringSimilarity(comparableA, comparableB);
  const tokensSimilarity = tokenSimilarity(comparableA, comparableB);
  const romanisationSimilarity = romanisationEvaluated
    ? stringSimilarity(khmerRomanisation?.value ?? "", canonicalLatin ?? "")
    : null;
  const orderDifference = hasSameTokensInDifferentOrder(comparableA, comparableB);
  const partialNameDetected = hasMissingNamePart(comparableA, comparableB);
  const formattingDetected = !exactInputMatch && normalizedMatch;
  const latinDistance =
    scriptA === "Latin" && scriptB === "Latin"
      ? levenshteinDistance(normalizedA, normalizedB)
      : null;
  const possibleTypingError = Boolean(
    latinDistance !== null &&
      latinDistance > 0 &&
      latinDistance <= 2 &&
      !orderDifference &&
      !partialNameDetected,
  );

  const romanisationVariant: DetectionValue = !crossScript
    ? "Not evaluated"
    : !romanisationEvaluated
      ? "Not evaluated"
      : (romanisationSimilarity ?? 0) >= 85
        ? "Possible"
        : "Not detected";
  const typingError: DetectionValue =
    scriptA === "Latin" && scriptB === "Latin"
      ? possibleTypingError
        ? "Possible"
        : "Not detected"
      : "Not evaluated";

  let score = romanisationSimilarity === null
    ? Math.round(characterSimilarity * 0.65 + tokensSimilarity * 0.35)
    : Math.round(
        characterSimilarity * 0.35 + tokensSimilarity * 0.3 + romanisationSimilarity * 0.35,
      );
  if (orderDifference) score = Math.round(characterSimilarity * 0.25 + tokensSimilarity * 0.75);
  if (exactInputMatch || normalizedMatch) score = 100;

  const withoutExplanation: Omit<ComparisonResult, "explanation"> = {
    inputA,
    inputB,
    scriptA,
    scriptB,
    normalizedA: normalizedA || "—",
    normalizedB: normalizedB || "—",
    romanisedA: scriptA === "Khmer" && khmerRomanisation?.fullyKnown ? khmerRomanisation.value : null,
    romanisedB: scriptB === "Khmer" && khmerRomanisation?.fullyKnown ? khmerRomanisation.value : null,
    score,
    status: similarityStatus(score),
    comparisonType: comparisonTypeFor(
      scriptA,
      scriptB,
      exactInputMatch,
      formattingDetected,
      orderDifference,
      partialNameDetected,
    ),
    writingSystem: `${scriptA} ↔ ${scriptB}`,
    exactInputMatch,
    normalizedMatch,
    romanisationVariant,
    typingError,
    nameOrderDifference: orderDifference ? "Detected" : "Not detected",
    formattingDifference: formattingDetected ? "Detected" : "Not detected",
    partialName: partialNameDetected ? "Detected" : "Not detected",
    phoneticSimilarity: "Not evaluated",
    characterSimilarity,
    tokenSimilarity: tokensSimilarity,
    romanisationSimilarity,
  };

  return { ...withoutExplanation, explanation: buildExplanation(withoutExplanation) };
}

function resultTone(value: string): string {
  if (["Detected", "Yes", "High Similarity"].includes(value)) return "success";
  if (["Possible", "Moderate Similarity"].includes(value)) return "warning";
  if (["Not evaluated", "Not detected", "No"].includes(value)) return "neutral";
  if (value === "Low Similarity") return "danger";
  return "info";
}

function MetricBar({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="ncv2-metric">
      <div className="ncv2-metric-head">
        <span>{label}</span>
        <strong>{value === null ? "Not evaluated" : `${value}%`}</strong>
      </div>
      {value === null ? (
        <div className="ncv2-metric-unavailable">No Week 1 implementation</div>
      ) : (
        <div
          className="ncv2-progress"
          role="progressbar"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={value}
        >
          <span style={{ width: `${value}%` }} />
        </div>
      )}
    </div>
  );
}

function KhmerLogoIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="ncv2-flag-icon"
      aria-hidden="true"
    >
      <path
        d="M0 10C0 11.7324 0.440742 13.3619 1.2159 14.7826L10 15.6522L18.7841 14.7826C19.5593 13.3619 20 11.7324 20 10C20 8.2676 19.5593 6.63815 18.7841 5.21741L10 4.34784L1.2159 5.21741C0.440742 6.63815 0 8.2676 0 10Z"
        fill="#D80027"
      />
      <path
        d="M1.2168 5.21738H18.785C17.0889 2.10895 13.7913 0 10.0009 0C6.21047 0 2.91285 2.10895 1.2168 5.21738Z"
        fill="#0052B4"
      />
      <path
        d="M10.0009 20C13.7913 20 17.0889 17.891 18.785 14.7826H1.2168C2.91285 17.891 6.21047 20 10.0009 20Z"
        fill="#0052B4"
      />
      <path
        d="M13.4784 11.9565V10.6522H12.6089V8.91303L11.7393 8.04346L10.8697 8.91303V7.17389L10.0002 6.30432L9.13059 7.17389V8.91303L8.26102 8.04346L7.39145 8.91303V10.6522H6.52191V11.9565H5.65234V13.2608H14.348V11.9565H13.4784Z"
        fill="#F0F0F0"
      />
    </svg>
  );
}

function LatinLogoIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="ncv2-flag-icon"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="10" fill="#F0F0F0" />
      <g clipPath="url(#us-circle-flag-clip)">
        <path
          d="M0 1.54h20v1.54H0zM0 4.62h20v1.54H0zM0 7.69h20v1.54H0zM0 10.77h20v1.54H0zM0 13.85h20v1.54H0zM0 16.92h20v1.54H0z"
          fill="#D80027"
        />
        <rect width="9.2" height="10.8" fill="#0052B4" />
        <g fill="#F0F0F0">
          <circle cx="2.3" cy="2.5" r="0.75" />
          <circle cx="4.9" cy="2.5" r="0.75" />
          <circle cx="7.5" cy="2.5" r="0.75" />
          <circle cx="3.6" cy="5.4" r="0.75" />
          <circle cx="6.2" cy="5.4" r="0.75" />
          <circle cx="2.3" cy="8.3" r="0.75" />
          <circle cx="4.9" cy="8.3" r="0.75" />
          <circle cx="7.5" cy="8.3" r="0.75" />
        </g>
      </g>
      <defs>
        <clipPath id="us-circle-flag-clip">
          <circle cx="10" cy="10" r="10" />
        </clipPath>
      </defs>
    </svg>
  );
}

function MixedLogoIcon({ size = 16 }: { size?: number }) {
  return (
    <span
      className="ncv2-script-logo is-mixed"
      style={{ display: "inline-flex", alignItems: "center", gap: "2px" }}
      aria-hidden="true"
    >
      <KhmerLogoIcon size={size * 0.8} />
      <span style={{ fontSize: "10px", color: "var(--muted)" }}>/</span>
      <LatinLogoIcon size={size * 0.8} />
    </span>
  );
}

function ScriptBadge({ script, size = 15 }: { script: ScriptType; size?: number }) {
  return (
    <span className={`ncv2-script-badge is-${script.toLowerCase()}`}>
      {script === "Khmer" ? (
        <KhmerLogoIcon size={size} />
      ) : script === "Latin" ? (
        <LatinLogoIcon size={size} />
      ) : script === "Mixed" ? (
        <MixedLogoIcon size={size} />
      ) : (
        <Languages size={size - 2} aria-hidden="true" />
      )}
      <span>{script}</span>
    </span>
  );
}

export default function NameComparisonPage() {
  const [nameA, setNameA] = useState("សុខ ដារ៉ា");
  const [nameB, setNameB] = useState("Sokh Dara");
  const [result, setResult] = useState<ComparisonResult | null>(() =>
    compareNames("សុខ ដារ៉ា", "Sokh Dara"),
  );
  const [swapAnimationKey, setSwapAnimationKey] = useState(0);

  const scriptA = useMemo(() => detectScriptType(nameA), [nameA]);
  const scriptB = useMemo(() => detectScriptType(nameB), [nameB]);
  const canCompare = Boolean(nameA.trim() && nameB.trim());

  const markChanged = () => {
    setResult(null);
  };

  const updateNameA = (value: string) => {
    setNameA(value);
    markChanged();
  };

  const updateNameB = (value: string) => {
    setNameB(value);
    markChanged();
  };

  const handleCompare = () => {
    if (!canCompare) return;
    setResult(compareNames(nameA, nameB));
  };

  const handleSwap = () => {
    setNameA(nameB);
    setNameB(nameA);
    setResult(null);
    setSwapAnimationKey((current) => current + 1);
  };

  const handleClear = () => {
    setNameA("");
    setNameB("");
    setResult(null);
  };

  const detectionRows = result
    ? [
        { label: "Writing System", value: result.writingSystem },
        { label: "Exact Input Match", value: result.exactInputMatch ? "Yes" : "No" },
        { label: "Normalized Match", value: result.normalizedMatch ? "Yes" : "No" },
        { label: "Romanisation Variant", value: result.romanisationVariant },
        { label: "Typing Error", value: result.typingError },
        { label: "Name Order Difference", value: result.nameOrderDifference },
        { label: "Formatting Difference", value: result.formattingDifference },
        { label: "Partial Name", value: result.partialName },
        { label: "Phonetic Similarity", value: result.phoneticSimilarity },
      ]
    : [];

  return (
    <div className="ncv2-page">
      <PageHeader
        title="Name Comparison"
        description="Compare Khmer and Latin names to identify spelling variations and possible matches."
      />

      <section className="ncv2-card" aria-label="Name Comparison Form">
        <div className="ncv2-input-grid">
          <label className="ncv2-field">
            <span className="ncv2-field-label">
              <strong>Name A</strong>
              <ScriptBadge script={scriptA} />
            </span>
            <input
              key={`name-a-${swapAnimationKey}`}
              value={nameA}
              onChange={(event) => updateNameA(event.target.value)}
              placeholder="Enter a Khmer or Latin name"
              className={`${scriptA === "Khmer" ? "khmer" : ""} ${
                swapAnimationKey ? "ncv2-swap-box-from-right" : ""
              }`}
              autoComplete="off"
            />
          </label>

          <div className="ncv2-swap-between">
            <button
              className="ncv2-swap-control"
              type="button"
              onClick={handleSwap}
              disabled={!nameA && !nameB}
              aria-label="Swap Name A and Name B"
              title="Swap names"
            >
              <ArrowLeftRight
                key={swapAnimationKey}
                className={swapAnimationKey ? "is-swapping" : ""}
                size={18}
                aria-hidden="true"
              />
            </button>
          </div>

          <label className="ncv2-field">
            <span className="ncv2-field-label">
              <strong>Name B</strong>
              <ScriptBadge script={scriptB} />
            </span>
            <input
              key={`name-b-${swapAnimationKey}`}
              value={nameB}
              onChange={(event) => updateNameB(event.target.value)}
              placeholder="Enter a Khmer or Latin name"
              className={`${scriptB === "Khmer" ? "khmer" : ""} ${
                swapAnimationKey ? "ncv2-swap-box-from-left" : ""
              }`}
              autoComplete="off"
            />
          </label>
        </div>

        <div className="ncv2-actions">
          <button className="ncv2-btn is-primary" type="button" onClick={handleCompare} disabled={!canCompare}>
            <GitCompareArrows size={17} aria-hidden="true" /> Compare Names
          </button>
          <button className="ncv2-btn" type="button" onClick={handleClear} disabled={!nameA && !nameB}>
            <Eraser size={17} aria-hidden="true" /> Clear
          </button>
        </div>

        {!result ? (
          <div className="ncv2-empty-result ncv2-inline-empty-result" aria-live="polite">
            <GitCompareArrows size={22} aria-hidden="true" />
            <div>
              <h2>Comparison Result</h2>
              <p>Click Compare Names to evaluate the current inputs.</p>
            </div>
          </div>
        ) : (
          <div
            className={`ncv2-inline-result ncv2-result-card is-${resultTone(result.status)}`}
            aria-labelledby="comparison-result-title"
          >
            <div className="ncv2-section-head">
              <h2 id="comparison-result-title">Comparison Result</h2>
              <span className={`ncv2-result-badge is-${resultTone(result.status)}`}>
                {result.status}
              </span>
            </div>

            <div className="ncv2-result-summary">
              <div className="ncv2-score-block">
                <ProgressBarHalfCircle size="md" min={0} max={100} value={result.score} />
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="ncv2-connected-results">
            {/* Section 1: Normalized Names & Summary */}
            <section className="ncv2-connected-section" aria-labelledby="normalized-names-title">
              <div className="ncv2-section-head">
                <h2 id="normalized-names-title">Normalized Names & Summary</h2>
              </div>

              <div className="ncv2-explanation">
                <Info size={18} aria-hidden="true" />
                <p>{result.explanation}</p>
              </div>

              <div className="ncv2-normalized-grid">
                <article className="ncv2-normalized-card">
                  <div className="ncv2-norm-card-head">
                    <span>Name A</span>
                    <ScriptBadge script={scriptA} size={13} />
                  </div>
                  <strong className={scriptA === "Khmer" ? "khmer" : ""}>{nameA}</strong>
                  <div className="ncv2-norm-details">
                    <div className="ncv2-norm-row">
                      <small>Normalized:</small>
                      <code>{result.normalizedA}</code>
                    </div>
                    {result.romanisedA && (
                      <div className="ncv2-norm-row">
                        <small>Dictionary Romanisation:</small>
                        <span className="ncv2-romanised-val">{result.romanisedA}</span>
                      </div>
                    )}
                  </div>
                </article>

                <article className="ncv2-normalized-card">
                  <div className="ncv2-norm-card-head">
                    <span>Name B</span>
                    <ScriptBadge script={scriptB} size={13} />
                  </div>
                  <strong className={scriptB === "Khmer" ? "khmer" : ""}>{nameB}</strong>
                  <div className="ncv2-norm-details">
                    <div className="ncv2-norm-row">
                      <small>Normalized:</small>
                      <code>{result.normalizedB}</code>
                    </div>
                    {result.romanisedB && (
                      <div className="ncv2-norm-row">
                        <small>Dictionary Romanisation:</small>
                        <span className="ncv2-romanised-val">{result.romanisedB}</span>
                      </div>
                    )}
                  </div>
                </article>
              </div>
            </section>

            {/* Section 2: Match Analysis */}
            <section className="ncv2-connected-section" aria-labelledby="match-analysis-title">
              <div className="ncv2-section-head">
                <h2 id="match-analysis-title">Match Analysis</h2>
              </div>

              <div className="ncv2-analysis-grid">
                <div className="ncv2-analysis-col">
                  <h3 className="ncv2-sub-head">Algorithm Scores</h3>
                  <div className="ncv2-metrics-stack">
                    <MetricBar label="Character Similarity" value={result.characterSimilarity} />
                    <MetricBar label="Token Similarity" value={result.tokenSimilarity} />
                    <MetricBar label="Romanisation Similarity" value={result.romanisationSimilarity} />
                    <MetricBar label="Phonetic Similarity" value={null} />
                  </div>
                </div>

                <div className="ncv2-analysis-col">
                  <h3 className="ncv2-sub-head">Detection Signals</h3>
                  <div className="ncv2-signals-list">
                    {detectionRows.map((row) => (
                      <div key={row.label} className="ncv2-signal-row">
                        <span className="ncv2-signal-label">{row.label}</span>
                        {row.label === "Writing System" ? (
                          <span className="ncv2-writing-system-val">
                            <KhmerLogoIcon size={13} />
                            <span>Khmer</span>
                            <span className="ncv2-type-sep">↔</span>
                            <span>Latin</span>
                            <LatinLogoIcon size={13} />
                          </span>
                        ) : (
                          <span className={`ncv2-result-badge is-${resultTone(row.value)}`}>
                            {row.value}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </section>
    </div>
  );
}
