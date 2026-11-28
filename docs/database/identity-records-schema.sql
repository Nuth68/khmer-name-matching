-- Initial sketch: identity records and name-matching support tables.
-- Target: PostgreSQL (adjust types/indexes for other RDBMS).
-- Status: design sketch, not a migration applied to production.

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Canonical person/entity record. Keep this minimal; identity evidence lives in related tables.
CREATE TABLE identity_records (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    external_ref        text UNIQUE, -- optional source-system stable identifier
    status              text NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active', 'review', 'merged', 'inactive')),
    date_of_birth       date,
    gender              text CHECK (gender IN ('male', 'female', 'other', 'unknown')),
    nationality         text,
    place_of_birth      text,
    confidence_notes    text, -- human review notes; no automated identity certainty
    created_at          timestamptz NOT NULL DEFAULT now(),
    updated_at          timestamptz NOT NULL DEFAULT now(),
    created_by          text,
    updated_by          text
);

-- Name forms observed for an identity record. Supports Khmer, Latin, and mixed script.
CREATE TABLE identity_names (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    identity_record_id  uuid NOT NULL REFERENCES identity_records(id) ON DELETE CASCADE,
    script              text NOT NULL CHECK (script IN ('khmer', 'latin', 'mixed', 'unknown')),
    name_type           text NOT NULL DEFAULT 'primary'
                        CHECK (name_type IN ('primary', 'alias', 'maiden', 'historical', 'transliteration', 'other')),
    full_name           text NOT NULL,
    given_name          text,
    family_name         text,
    normalized_full_name text NOT NULL, -- NFC + trim/collapse whitespace + casefold (app-defined)
    phonetic_key        text,          -- optional future Soundex/Metaphone/Khmer phonetic key
    romanization_source text,          -- e.g. dictionary, user-input, document, manual-review
    is_primary          boolean NOT NULL DEFAULT false,
    language_hint       text,
    valid_from          date,
    valid_to            date,
    created_at          timestamptz NOT NULL DEFAULT now(),
    updated_at          timestamptz NOT NULL DEFAULT now(),
    CHECK (valid_to IS NULL OR valid_from IS NULL OR valid_to >= valid_from)
);

CREATE INDEX identity_names_record_idx ON identity_names(identity_record_id);
CREATE INDEX identity_names_normalized_idx ON identity_names(normalized_full_name);
CREATE INDEX identity_names_script_idx ON identity_names(script);
CREATE INDEX identity_names_phonetic_idx ON identity_names(phonetic_key) WHERE phonetic_key IS NOT NULL;

-- Source documents / evidence used to support an identity record.
CREATE TABLE identity_documents (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    identity_record_id  uuid NOT NULL REFERENCES identity_records(id) ON DELETE CASCADE,
    document_type       text NOT NULL, -- national_id, passport, birth_certificate, etc.
    document_number     text,
    issuing_country     text,
    issuing_authority   text,
    issued_date         date,
    expiry_date         date,
    document_hash       text, -- hash/fingerprint, avoid storing raw sensitive scans in this table
    verification_status text NOT NULL DEFAULT 'unverified'
                        CHECK (verification_status IN ('unverified', 'verified', 'rejected', 'expired')),
    source_system       text,
    created_at          timestamptz NOT NULL DEFAULT now(),
    updated_at          timestamptz NOT NULL DEFAULT now(),
    CHECK (expiry_date IS NULL OR issued_date IS NULL OR expiry_date >= issued_date)
);

CREATE INDEX identity_documents_record_idx ON identity_documents(identity_record_id);
CREATE INDEX identity_documents_number_idx ON identity_documents(document_type, document_number)
    WHERE document_number IS NOT NULL;

-- Contact/location attributes are kept separate because they change over time and may be sensitive.
CREATE TABLE identity_attributes (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    identity_record_id  uuid NOT NULL REFERENCES identity_records(id) ON DELETE CASCADE,
    attribute_type      text NOT NULL, -- phone, email, address, province, etc.
    attribute_value     text NOT NULL,
    normalized_value    text,
    is_current          boolean NOT NULL DEFAULT true,
    source_system       text,
    valid_from          date,
    valid_to            date,
    created_at          timestamptz NOT NULL DEFAULT now(),
    updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX identity_attributes_record_idx ON identity_attributes(identity_record_id);
CREATE INDEX identity_attributes_type_value_idx ON identity_attributes(attribute_type, normalized_value);

-- Pairwise comparison audit/result. Useful for review queues and explainability.
CREATE TABLE name_comparison_results (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    left_identity_name_id  uuid REFERENCES identity_names(id) ON DELETE SET NULL,
    right_identity_name_id uuid REFERENCES identity_names(id) ON DELETE SET NULL,
    left_name_input     text NOT NULL,
    right_name_input    text NOT NULL,
    normalized_left     text NOT NULL,
    normalized_right    text NOT NULL,
    script_pair         text NOT NULL, -- khmer-khmer, latin-latin, khmer-latin, mixed, etc.
    method              text NOT NULL, -- levenshtein, dictionary-assisted, unavailable, future-phonetic
    score               smallint CHECK (score IS NULL OR (score >= 0 AND score <= 100)),
    edit_distance       integer CHECK (edit_distance IS NULL OR edit_distance >= 0),
    compared_length     integer CHECK (compared_length IS NULL OR compared_length >= 0),
    matched_variant     text,
    variant_type        text,
    dictionary_entry    jsonb,         -- snapshot of dictionary evidence used
    explanation         text NOT NULL,
    decision            text CHECK (decision IN ('pending', 'accepted', 'rejected', 'needs_review')),
    reviewed_by         text,
    reviewed_at         timestamptz,
    request_metadata    jsonb,         -- caller, trace id, API version; avoid PII beyond names if possible
    created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX name_comparison_results_left_idx ON name_comparison_results(left_identity_name_id);
CREATE INDEX name_comparison_results_right_idx ON name_comparison_results(right_identity_name_id);
CREATE INDEX name_comparison_results_score_idx ON name_comparison_results(score);
CREATE INDEX name_comparison_results_created_idx ON name_comparison_results(created_at DESC);

-- Candidate identity matches / merge review queue. Name similarity is evidence, not identity proof.
CREATE TABLE identity_match_candidates (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    left_record_id      uuid NOT NULL REFERENCES identity_records(id) ON DELETE CASCADE,
    right_record_id     uuid NOT NULL REFERENCES identity_records(id) ON DELETE CASCADE,
    comparison_result_id uuid REFERENCES name_comparison_results(id) ON DELETE SET NULL,
    match_status        text NOT NULL DEFAULT 'pending'
                        CHECK (match_status IN ('pending', 'review', 'accepted', 'rejected', 'merged')),
    overall_score       numeric(5,2) CHECK (overall_score IS NULL OR (overall_score >= 0 AND overall_score <= 100)),
    score_breakdown     jsonb, -- name score, DOB match, document match, etc.
    reason              text,
    reviewed_by         text,
    reviewed_at         timestamptz,
    created_at          timestamptz NOT NULL DEFAULT now(),
    updated_at          timestamptz NOT NULL DEFAULT now(),
    CHECK (left_record_id <> right_record_id)
);

CREATE UNIQUE INDEX identity_match_candidates_pair_idx
    ON identity_match_candidates (LEAST(left_record_id, right_record_id), GREATEST(left_record_id, right_record_id))
    WHERE match_status IN ('pending', 'review');

CREATE INDEX identity_match_candidates_status_idx ON identity_match_candidates(match_status);

COMMIT;
