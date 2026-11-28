# Identity Records Database Sketch

Initial design sketch for future identity storage and name-matching review workflows. This is **not** a migration and has not been applied.

## Goals

- Store canonical identity records separately from names, documents, and attributes.
- Support multiple name forms per identity (Khmer, Latin, mixed, aliases, transliterations).
- Capture name-comparison results as explainable audit/evidence records.
- Support human review/merge workflows without treating name similarity as identity proof.

## Tables

| Table | Purpose | Key fields |
|---|---|---|
| `identity_records` | Canonical person/entity record | `id`, `status`, `date_of_birth`, `gender`, audit fields |
| `identity_names` | Name forms for a record | `identity_record_id`, `script`, `name_type`, `full_name`, `normalized_full_name`, `phonetic_key` |
| `identity_documents` | Identity evidence documents | `identity_record_id`, `document_type`, `document_number`, `verification_status`, `document_hash` |
| `identity_attributes` | Changeable/sensitive attributes | `identity_record_id`, `attribute_type`, `attribute_value`, `normalized_value`, validity |
| `name_comparison_results` | Comparison audit/explainability | input names, normalized names, `method`, `score`, `explanation`, `dictionary_entry`, review decision |
| `identity_match_candidates` | Possible duplicate/merge queue | left/right record IDs, comparison reference, `match_status`, `overall_score`, `score_breakdown` |

## Design Notes

- **Normalization**: store `normalized_full_name` using the same app rule as comparison (NFC, trim/collapse whitespace, casefold) for consistent lookup.
- **No auto-merge**: `identity_match_candidates` is a review queue; acceptance/merge requires human/process decision and supporting evidence.
- **Explainability**: `name_comparison_results` stores method, score, distance, matched variant, and dictionary snapshot.
- **Sensitive data**: avoid storing raw document scans in core tables; prefer `document_hash`/secure object storage references. Restrict access to DOB/document/contact fields.
- **Extensibility**: add phonetic keys, embeddings, source provenance, and record merge history tables when needed.

## Next Steps

1. Confirm target DB (PostgreSQL recommended) and migration tool (Prisma/TypeORM/Drizzle/Alembic/SQL migrations).
2. Align fields with frontend `IdentityRecord` type and backend domain model.
3. Add merge-history/audit-log table before any merge feature.
4. Add constraints/indexes based on real query patterns and privacy requirements.
