# T33 - UI Manual Test Cases

## Scope
Manual UI test cases for Khmer Name Matching web app (`web/`). Focus: navigation, core pages, input/validation, actions, and visible states.

## Environment
- App running locally (Vite dev/build preview).
- Browser: latest Chrome/Edge.
- Test data: fictional/synthetic records only.

## Test Cases

| ID | Title | Priority | Preconditions | Test Data | Steps | Expected Result | Postconditions |
|---|---|---|---|---|---|---|---|
| UI-TC-001 | App loads default dashboard | High | App started; browser cache cleared. | N/A | 1. Open app root URL. 2. Observe initial route/content. | Dashboard loads without console-blocking UI error; sidebar and breadcrumb visible; active route is Dashboard. | None. |
| UI-TC-002 | Sidebar navigation routes | High | App loaded. | N/A | 1. Click each sidebar item: Dashboard, Identity Records, Duplicate Detection, Review & Merge, Name Comparison, Khmer Romanisation, Smart Search, Import & Export, Data Quality, Developer pages, Settings. | Corresponding page renders; breadcrumb/active state updates; no blank screen. | Return to Dashboard. |
| UI-TC-003 | Mobile sidebar open/close | Medium | Viewport <= mobile breakpoint. | N/A | 1. Open mobile menu. 2. Tap overlay/close action. 3. Open menu and navigate to a route. | Sidebar opens/closes correctly; overlay appears/disappears; navigation closes mobile drawer appropriately. | Reset viewport. |
| UI-TC-004 | Sidebar collapse persistence | Medium | Desktop viewport. | N/A | 1. Collapse sidebar. 2. Refresh page. 3. Expand sidebar. 4. Refresh page. | Collapsed state persists via local storage (`km-sidebar-collapsed`); layout adjusts without overlap. | Clear local storage if needed. |
| UI-TC-005 | Language toggle persistence | Medium | Sidebar visible. | N/A | 1. Switch language EN/KM. 2. Verify labels change. 3. Refresh page. | Sidebar labels reflect selected language; selection persists (`km-sidebar-language`). | Reset to EN. |
| UI-TC-006 | Dark mode toggle | Low | App loaded. | N/A | 1. Toggle dark mode on/off. | Theme class/style updates; text remains readable; no broken contrast on key components. | Restore preferred theme. |
| UI-TC-007 | Route scroll reset | Medium | Long scrollable page available. | N/A | 1. Scroll down on Duplicate Detection/Records. 2. Navigate to another route. | New page starts at top of main content area. | None. |
| UI-TC-008 | Identity Records page render | High | Navigate to Identity Records. | Synthetic records. | 1. Open Identity Records. 2. Inspect table/list, columns, and actions. | Records display correctly; Khmer/Latin names readable; no layout break. | None. |
| UI-TC-009 | Smart Search basic query | High | Navigate to Smart Search. | Query: `Sok Dara` / `សុខ ដារ៉ា` | 1. Enter query. 2. Submit/search. 3. View results. | Relevant result(s) shown; empty/loading/error states handled gracefully. | Clear query. |
| UI-TC-010 | Smart Search no-result state | Medium | Smart Search open. | Query: `ZZZ_NOT_FOUND_123` | 1. Search unlikely string. | UI shows clear no-results state; no crash. | Clear query. |
| UI-TC-011 | Name Comparison valid input | High | Navigate to Name Comparison. | Left: `សុខ ដារ៉ា`, Right: `Sok Dara` | 1. Enter both names. 2. Click Compare. | Comparison result shown with score/badge/explanation sections; no JS error. | None. |
| UI-TC-012 | Name Comparison empty input handling | High | Name Comparison open. | Empty field(s). | 1. Clear one/both inputs. 2. Observe Compare button/result. | Compare action disabled or validation message shown; app does not submit invalid comparison. | Restore inputs. |
| UI-TC-013 | Name Comparison swap/copy actions | Medium | Comparison result visible. | Existing values. | 1. Click swap. 2. Click copy report. | Inputs swap correctly; copy action provides feedback (Copied). | Clipboard permission allowed. |
| UI-TC-014 | Duplicate Detection filters/search | High | Navigate to Duplicate Detection. | Search: `Sok` or case ID. | 1. Enter search text. 2. Use score/status filters. 3. Clear filters. | Table rows filter correctly; counts/pagination reflect filtered result; clear restores list. | Reset filters. |
| UI-TC-015 | Duplicate Detection compare action | High | Duplicate record visible. | Any pending case. | 1. Click Compare/Review action on row. | Navigates to Review & Merge with relevant case context (if implemented). | None. |
| UI-TC-016 | Review & Merge field decision required | High | Navigate to Review & Merge. | Default case KID-008421. | 1. Leave conflict field unselected. 2. Tick confirm. 3. Attempt merge. | Merge blocked until all differing/conflict fields selected and confirmation checked; blocked reason visible. | None. |
| UI-TC-017 | Review & Merge successful merge | High | Review & Merge open. | Choose value for phone conflict. | 1. Select values for all differing fields. 2. Tick confirmation. 3. Click Merge. | Success banner shown; merge action disabled/marked complete; message indicates originals remain in history. | Refresh page. |
| UI-TC-018 | Import & Export template download | High | Navigate to Import & Export. | N/A | 1. Click Download template (.CSV). | CSV template downloads; contains expected headers (`full_name_kh,full_name_en,id_card_no,birth_date,gender,phone,province`). | Delete downloaded file. |
| UI-TC-019 | Import wizard sample dataset flow | High | Import & Export open. | Sample dataset button. | 1. Load sample dataset. 2. Proceed to column mapping. 3. Proceed through validation/confirm/import. | Stepper advances correctly; mapping/validation/summary shown; success toast/history entry appears after import. | None. |
| UI-TC-020 | Import invalid/missing file handling | Medium | Import & Export step 1. | Invalid file type/empty upload. | 1. Attempt upload unsupported file or no file. 2. Attempt proceed. | User receives clear validation/error; wizard does not advance with invalid input. | None. |
| UI-TC-021 | Export data action | Medium | Import & Export open. | Scope: all/verified/review; Format: csv/xlsx/json. | 1. Open Export modal. 2. Select scope+format. 3. Confirm export. | Modal closes; success toast/message shown; export action uses selected options. | None. |
| UI-TC-022 | Data Quality dashboard render | Medium | Navigate to Data Quality. | N/A | 1. Open page. 2. Switch tabs Overview/Issues/Recommendations. | KPI cards, charts/tables, and tabs render correctly; tab content changes. | None. |
| UI-TC-023 | Data Quality run check action | Medium | Data Quality open. | N/A | 1. Click Run quality check. | Loading/progress state shown if implemented; completion updates UI without error. | None. |
| UI-TC-024 | Algorithm Evaluation setup controls | Medium | Navigate to Algorithm Evaluation. | Dataset/threshold inputs. | 1. Change dataset. 2. Adjust similarity threshold. 3. Click Run evaluation. | Controls accept input; displayed metrics/confusion matrix update or remain consistent; no UI crash. | None. |
| UI-TC-025 | Developer page/API docs access | Medium | Navigate to API Documentation/Playground/Keys. | N/A | 1. Open each developer tab/page. | Relevant developer content renders; links/buttons are actionable; no dead-end blank view. | None. |
| UI-TC-026 | Settings page save/cancel behavior | Medium | Navigate to Settings. | Change a non-destructive setting. | 1. Modify setting. 2. Save/cancel/reload as applicable. | Save persists or cancel reverts; validation errors shown for invalid settings. | Restore original setting. |
| UI-TC-027 | Accessibility keyboard navigation | Medium | App loaded. | Keyboard only. | 1. Tab through sidebar, main actions, forms, modals. 2. Use Enter/Space/Esc. | Focus visible; interactive controls reachable; modal closes with Esc if supported. | None. |
| UI-TC-028 | Responsive layout sanity | Medium | Desktop/tablet/mobile widths. | N/A | 1. Resize to 1440/1024/768/375 widths. 2. Visit key pages. | No horizontal overflow/broken overlap on key workflows; buttons/tables remain usable. | Reset width. |
