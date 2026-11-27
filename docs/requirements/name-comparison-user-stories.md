# K-ID — Name Comparison User Stories and Acceptance Criteria

**Project:** Khmer Intelligent Identity Resolution Platform (K-ID)  
**Prepared by:** SOKHOM PANHA  
**Role:** Project Manager / Security Planning  
**Document type:** Feature requirements  
**Status:** Draft for team review  
**Date:** 27 November 2026

---

## 1. Feature Overview

The Name Comparison feature allows a user to compare two names written in Khmer, Latin, or a mixture of scripts. It identifies possible name variations, such as romanisation differences, spelling differences, formatting differences, and name-order differences.

The feature returns a similarity score, a comparison status, detected differences, and an explanation of the result.

**Important:** Similarity between two names does not prove that the names belong to the same person. The result is a candidate for review, not an identity confirmation.

## 2. Goals

- Support Khmer–Khmer name comparison.
- Support Latin–Latin name comparison.
- Support Khmer–Latin name comparison.
- Identify supported romanisation variants.
- Identify common spelling and formatting differences.
- Explain how the comparison result was produced.
- Provide consistent behavior that can be tested by the frontend, backend, NLP, and QA team members.

## 3. Out of Scope for Week 1

- Frontend-to-backend API integration.
- Automatic merging of identity records.
- Claiming that a similarity score is the probability that two records belong to the same person.
- Advanced phonetic matching unless the NLP team has implemented and tested it.
- Production-scale performance guarantees.

During Week 1, the frontend may use mock JSON. The backend and matching algorithm should be developed and tested independently.

---

## 4. User Stories and Acceptance Criteria

### US-01 — Enter Two Names

**User story**

As a user, I want to enter two names so that I can compare them.

**Acceptance criteria**

- [ ] The page provides separate inputs for Name A and Name B.
- [ ] Both inputs accept Khmer and Latin text.
- [ ] The user can enter spaces and multiple name parts.
- [ ] The system displays a clear validation message if either required input is empty.
- [ ] The user can clear the entered names.
- [ ] Input is displayed correctly, including Khmer characters.

### US-02 — Detect the Writing System

**User story**

As a user, I want the system to identify the writing system of each input so that I can understand what kind of comparison is being performed.

**Acceptance criteria**

- [ ] The system can identify Khmer-script text.
- [ ] The system can identify Latin-script text.
- [ ] The system can identify mixed-script text.
- [ ] The system can identify empty or unsupported input.
- [ ] The detected script is displayed for each name.
- [ ] Script detection does not claim to identify a person's language or nationality.

### US-03 — Compare Names Across Scripts

**User story**

As a user, I want to compare Khmer and Latin names so that I can find possible equivalent spellings across writing systems.

**Acceptance criteria**

- [ ] The feature supports Khmer–Khmer comparisons.
- [ ] The feature supports Latin–Latin comparisons.
- [ ] The feature supports Khmer–Latin comparisons.
- [ ] The result identifies the comparison type.
- [ ] The result shows the score and explanation returned by the implemented comparison logic.
- [ ] Unsupported comparisons produce a clear message rather than a fabricated result.

### US-04 — Identify Romanisation Variations

**User story**

As a user, I want the system to recognize documented Latin spelling variants of Khmer names so that I can find possible matches even when romanisation differs.

**Acceptance criteria**

- [ ] The matching logic uses a documented romanisation dictionary or rules.
- [ ] Supported variants are recorded with their Khmer source form and variant information.
- [ ] The example `សុខ`, `Sok`, and `Sokh` can be used as a test case after the NLP team validates the mapping.
- [ ] The system reports a romanisation variation only when its implemented rules or dictionary support that result.
- [ ] The explanation identifies the relevant supported variation.
- [ ] Unknown variants are not automatically treated as equivalent.

### US-05 — Identify Possible Typing and Spelling Errors

**User story**

As a user, I want the system to detect supported spelling differences so that I can recognize names that may differ because of typing mistakes.

**Acceptance criteria**

- [ ] The system can report supported character insertions, deletions, or substitutions.
- [ ] The system can compare names with small Latin spelling differences.
- [ ] The system can report supported Khmer character differences if the algorithm implements them.
- [ ] The result distinguishes a detected text difference from a confirmed identity match.
- [ ] Unsupported keyboard-error detection is labelled as not evaluated.

### US-06 — Display a Similarity Score

**User story**

As a user, I want to see a similarity score so that I can understand how closely the two names match according to the implemented algorithm.

**Acceptance criteria**

- [ ] The result displays a numeric score from 0 to 100 when a score is available.
- [ ] The score is calculated by the implemented algorithm; it is not random or hardcoded as if it were calculated.
- [ ] The result displays the configured similarity category, if thresholds have been agreed and documented.
- [ ] The score is described as name similarity, not the probability that two records belong to the same person.
- [ ] If the comparison cannot be evaluated, the page displays an appropriate message instead of inventing a score.

**Provisional display bands for prototype discussion only**

| Score | Suggested label |
|---|---|
| 85–100 | High similarity |
| 60–84 | Moderate similarity |
| 0–59 | Low similarity |

These bands are provisional. The team must validate thresholds using labelled validation data before treating them as operational decision rules.

### US-07 — Explain the Comparison Result

**User story**

As a user, I want to see why two names received their result so that I can understand the differences and decide whether further review is needed.

**Acceptance criteria**

- [ ] The result displays the comparison type.
- [ ] The result displays detected differences or variations.
- [ ] The explanation reflects the actual logic that ran.
- [ ] Unsupported checks are shown as “Not evaluated.”
- [ ] The explanation does not claim that two names belong to the same person based on name similarity alone.

### US-08 — Load Example Names

**User story**

As a user, I want to choose predefined examples so that I can try the comparison feature without typing every name manually.

**Acceptance criteria**

- [ ] The page provides a set of clearly labelled example pairs.
- [ ] Selecting an example fills Name A and Name B.
- [ ] Examples cover Khmer–Latin, Latin spelling variants, formatting, name order, and non-matching names.
- [ ] Example labels describe the scenario being demonstrated.
- [ ] Examples are clearly identified as test examples, not verified real-person records.

### US-09 — Swap the Names

**User story**

As a user, I want to swap Name A and Name B so that I can compare the inputs in the opposite order.

**Acceptance criteria**

- [ ] The page provides a Swap action.
- [ ] Selecting Swap exchanges the complete values of Name A and Name B.
- [ ] The user can run the comparison after swapping.
- [ ] The action does not change or lose the entered text.

### US-10 — Clear the Comparison

**User story**

As a user, I want to clear the comparison so that I can start a new one.

**Acceptance criteria**

- [ ] The page provides a Clear action.
- [ ] Selecting Clear empties both name inputs.
- [ ] The previous result and validation messages are cleared.
- [ ] The page returns to its initial state.

---

## 5. Example Test Scenarios

These are proposed functional test scenarios. Expected outcomes must be confirmed against the actual romanisation rules and matching implementation.

| ID | Name A | Name B | Scenario | Expected behavior |
|---|---|---|---|---|
| TC-01 | `សុខ ដារ៉ា` | `Sok Dara` | Khmer–Latin | Identify cross-script comparison; evaluate supported romanisation |
| TC-02 | `Sok Dara` | `Sokh Dara` | Latin spelling variant | Identify variant only if supported by the dictionary/rules |
| TC-03 | `Sok Dara` | `Sok Draa` | Possible typing error | Report text difference and calculated score |
| TC-04 | `Sok Dara` | `Dara Sok` | Name order | Identify token-order difference if implemented |
| TC-05 | `SOK DARA` | `sok dara` | Capitalization | Identify formatting-only difference after normalization |
| TC-06 | `Sok Dara` | `Chan Visal` | Different names | Return the algorithm's calculated result; do not force a match |
| TC-07 | `សុខ` | `សុខ` | Exact Khmer match | Identify exact match after the agreed normalization |
| TC-08 | `Sok Dara` | empty | Missing input | Display required-field validation |
| TC-09 | `Sok Dara` | `Sok Dara` | Exact Latin match | Identify exact match |
| TC-10 | mixed Khmer/Latin text | `Sok Dara` | Mixed-script input | Identify mixed script or follow the agreed validation behavior |

## 6. Week 1 Team Responsibilities and Review

| Team member | Responsibility for this feature |
|---|---|
| SOKHOM PANHA | Coordinate requirements, confirm scope, collect team feedback, and maintain this document |
| PRAVE VINUTH | Review whether the user stories can be represented in the Name Comparison UI; use mock JSON in Week 1 |
| SOTH PICHPANHA | Review backend feasibility and agree on the future request/response contract |
| THOU LAIHENG | Review Khmer script detection, normalization, romanisation, and algorithm feasibility |
| YI MONIROM | Prepare labelled examples and test cases; identify uncertain labels for review |

## 7. Definition of Ready

The requirements are ready for implementation when:

- [ ] The team understands the purpose and scope of Name Comparison.
- [ ] User stories and acceptance criteria have been reviewed.
- [ ] Khmer–Khmer, Latin–Latin, and Khmer–Latin cases are covered.
- [ ] Romanisation and spelling-variation examples have been reviewed by the NLP owner.
- [ ] The API request and response fields are agreed for Week 2.
- [ ] QA has enough test scenarios to begin preparing test data.
- [ ] Unsupported or future functionality is clearly identified.

## 8. Definition of Done for This Requirements Task

- [ ] This document is saved in the repository at `docs/requirements/name-comparison-user-stories.md`.
- [ ] All user stories have acceptance criteria.
- [ ] Example test scenarios are included.
- [ ] Frontend, backend, NLP, and QA owners have reviewed the document.
- [ ] Review feedback and agreed changes are recorded.
- [ ] The document is committed and pushed to the team's GitHub repository.

## 9. Week 1 Constraints and Next Steps

**Week 1:** 21–29 November 2026

- Frontend develops the Name Comparison UI using mock JSON.
- Backend develops and tests its endpoint independently.
- Khmer NLP develops and tests the matching module independently.
- Dataset and QA prepares labelled examples and test scenarios.
- No frontend-to-backend integration is required in Week 1.

**Week 2:**

- Connect the frontend Name Comparison form to the FastAPI endpoint.
- Connect the endpoint to the matching module.
- Run end-to-end tests and resolve integration issues.

## 10. Decisions and Changes

| Date | Decision or change | Reason |
|---|---|---|
| 2026-11-27 | Prepared initial Name Comparison user stories and acceptance criteria | Week 1 project-management task |
| Pending | Team review and approval | To be completed after feedback |

---

**Document owner:** SOKHOM PANHA  
**Reviewers:** PRAVE VINUTH, SOTH PICHPANHA, THOU LAIHENG, YI MONIROM  
**Reminder:** Tick checklist items (`- [x]`) only after the corresponding work has actually been completed.