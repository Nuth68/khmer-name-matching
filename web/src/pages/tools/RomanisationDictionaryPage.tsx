import { useState } from "react";
import { Info, Search } from "lucide-react";
import Badge from "../../components/common/Badge";
import PageHeader from "../../components/common/PageHeader";
import {
  khmerRomanisationDictionary,
  type RomanisationVariantKind,
} from "../../data/khmerRomanisationDictionary";

const variantLabels: Record<RomanisationVariantKind, string> = {
  "mock-reference": "Mock reference",
  "spelling-candidate": "Spelling candidate",
  "spacing-candidate": "Spacing candidate",
  "name-order-candidate": "Name-order candidate",
};

export default function RomanisationDictionaryPage() {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const entries = khmerRomanisationDictionary.filter((entry) => {
    const searchText = [
      entry.khmer,
      ...entry.variants.map((variant) => variant.latin),
    ]
      .join(" ")
      .toLocaleLowerCase();

    return searchText.includes(normalizedQuery);
  });

  return (
    <>
      <PageHeader
        title="Romanisation Dictionary"
        description="Review Khmer names and candidate Latin spelling variants"
      />
      <section className="card romanisation-dictionary">
        <div className="romanisation-dictionary-toolbar">
          <label className="romanisation-dictionary-search">
            <Search size={16} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Khmer or Latin spelling"
              aria-label="Search Khmer or Latin spelling"
            />
          </label>
          <Badge tone="blue">
            {entries.length} {entries.length === 1 ? "entry" : "entries"}
          </Badge>
        </div>
        <div className="romanisation-dictionary-notice">
          <Info size={17} />
          <p>
            Draft seed data only. Mock references are not official spellings;
            candidate forms require human verification and must not be treated
            as confirmed identity matches.
          </p>
        </div>
        {entries.length ? (
          <div className="romanisation-dictionary-list">
            {entries.map((entry) => (
              <article
                className="romanisation-dictionary-entry"
                key={entry.id}
              >
                <div className="romanisation-dictionary-name">
                  <strong className="khmer">{entry.khmer}</strong>
                  <p>{entry.sourceNote}</p>
                </div>
                <div className="romanisation-dictionary-variants">
                  {entry.variants.map((variant) => (
                    <div className="romanisation-dictionary-variant" key={variant.latin}>
                      <div>
                        <strong>{variant.latin}</strong>
                        <p>{variant.note}</p>
                      </div>
                      <Badge
                        tone={
                          variant.kind === "mock-reference" ? "blue" : "warning"
                        }
                      >
                        {variantLabels[variant.kind]}
                      </Badge>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="romanisation-dictionary-empty">
            No entries match “{query}”.
          </p>
        )}
      </section>
    </>
  );
}
