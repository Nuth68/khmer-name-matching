export type RomanisationVariantKind =
  | "mock-reference"
  | "spelling-candidate"
  | "spacing-candidate"
  | "name-order-candidate";

export interface KhmerRomanisationVariant {
  latin: string;
  kind: RomanisationVariantKind;
  note: string;
}

export interface KhmerRomanisationEntry {
  id: string;
  khmer: string;
  sourceNote: string;
  variants: KhmerRomanisationVariant[];
}

export const khmerRomanisationDictionary: KhmerRomanisationEntry[] = [
  {
    id: "sok-dara",
    khmer: "សុខ ដារ៉ា",
    sourceNote:
      "Seeded from the existing Name Comparison demo. No spelling has been verified against a person's official record.",
    variants: [
      {
        latin: "Sok Dara",
        kind: "mock-reference",
        note: "Existing demo reference spelling; verify against the source record.",
      },
      {
        latin: "Sokh Dara",
        kind: "spelling-candidate",
        note: "Existing demo candidate; the final ខ may be represented as kh. Confirm identity before matching.",
      },
      {
        latin: "Sok Darra",
        kind: "spelling-candidate",
        note: "Existing demo candidate with doubled r; this spelling is not determined by the Khmer text.",
      },
      {
        latin: "Dara Sok",
        kind: "name-order-candidate",
        note: "Existing demo order variant; review local name order before treating it as an alias.",
      },
    ],
  },
  {
    id: "li-sreypich",
    khmer: "លី ស្រីពេជ្រ",
    sourceNote:
      "Seeded from an existing mock identity record. Variants below are proposed search forms, not verified aliases.",
    variants: [
      {
        latin: "Ly Sreypich",
        kind: "mock-reference",
        note: "Existing mock-record spelling; verify against the source record.",
      },
      {
        latin: "Li Sreypich",
        kind: "spelling-candidate",
        note: "Candidate Latin spelling for លី; confirm that it refers to the same person.",
      },
      {
        latin: "Ly Srey Pich",
        kind: "spacing-candidate",
        note: "Candidate word-boundary variation; Khmer text does not mark this Latin spacing.",
      },
    ],
  },
  {
    id: "chan-sophea",
    khmer: "ចាន់ សុភា",
    sourceNote:
      "Seeded from an existing mock identity record. The reference spelling is illustrative, not an official romanisation.",
    variants: [
      {
        latin: "Chan Sophea",
        kind: "mock-reference",
        note: "Existing mock-record spelling; verify against the source record.",
      },
      {
        latin: "Chann Sophea",
        kind: "spelling-candidate",
        note: "Candidate doubled-n spelling for ចាន់; confirm with a trusted record before matching.",
      },
    ],
  },
];
