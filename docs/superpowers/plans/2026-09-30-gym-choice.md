# Gym Choice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 조건 검색과 후보 비교를 완성하고 기존 서비스의 예외 처리·접근성을 검증한다.
**Architecture:** 서버 서비스가 정규화된 URL을 소비한다. 클라이언트는 동일 URL 생성기를 사용한다. 비교 선택은 탭 저장소와 메모리 fallback, 공유 비교는 URL ID를 권위로 삼는다.
**Tech Stack:** Next.js 16 / React 19 / TypeScript / Tailwind 4 / Vitest / Playwright.
**Spec:** ../specs/2026-09-30-gym-choice-design.md

## Global Constraints
- 사용자 요청대로 dev에서 기능별 커밋 후 push.
- 신규 DB/인증/실제 데이터 수집 없음.
- 미확인 정보를 false/0원으로 취급하지 않음.
- 비교는 최대 3개, 유효 ID 순서 유지.
- 기존 GPS 취소/IME 보호/이미지 fallback 유지.

## Review Focus
- 필터를 적용한 뒤 정렬/키워드/GPS 변경 시 조건 유실 → Task 2/4 브라우저 검증.
- 삭제/잘못된 비교 ID와 중복/과다 선택 → Task 3 순수/페이지 테스트.
- 저장소가 막힌 환경 및 새로고침 → Task 3 store 테스트, Task 4 E2E.
- 필터 결과 0개에서 조건을 다시 변경할 수 있어야 함 → Task 2 컴포넌트/Task 4 E2E.
- 비교 바가 모바일 콘텐츠/포커스를 가리지 않음 → Task 4 레이아웃·키보드 검증.

### Task 1: Search domain
Files: src/utils/search.ts, src/utils/gymFacts.ts, src/services/gymService.ts, src/types/gyms/types.ts, tests/filters.test.ts.
Produces: normalizeSearch filters, buildSearchHref, getDailyPrice, getFacilityStatus, filterGyms.
- [x] RED: 가격 0/상한, AND 시설, 강습 true/false/unknown, 중복 및 악성 파라미터.
- [x] GREEN: 타입과 순수 헬퍼, 서비스 결과/추천 분리.
- [x] Verify: npm test (all green).
- [x] Commit: feat: 암장 조건 검색과 공통 URL 규칙 추가.

### Task 2: Search UI
Files: src/components/search/*, src/hooks/useLocationSearch.ts, src/app/search/page.tsx, tests/filter-ui.test.tsx.
Consumes Task 1 URL normalization and gym facts.
- [x] RED: 필터 적용/초기화, 정렬·검색 시 조건 보존.
- [x] GREEN: 필터 폼, 선택 조건 표시, pending, 0건 복구, 카드 결정 정보.
- [x] Verify: npm test; npm run typecheck.
- [x] Commit: feat: 가격·시설·체험 강습 필터와 URL 상태 연결.

### Task 3: Comparison
Files: src/components/comparison/*, src/utils/comparison.ts, src/app/compare/page.tsx, src/app/layout.tsx, tests/comparison*.test.*.
Consumes gym facts and summary catalog; produces max-3 selection and shareable compare route.
- [x] RED: 중복/최대3/없는 ID/저장소 실패, 비교의 미확인 정보.
- [x] GREEN: selection provider/store, buttons, tray, server comparison data, responsive table/share/remove.
- [x] Verify: npm test; npm run typecheck.
- [x] Commit: feat: 암장 후보 선택과 공유 가능한 비교 페이지 추가.

### Task 4: Polish and validation
Files: common image/async UI as needed, e2e/*, README.md.
- [x] RED: 잘못된 이미지 URL; 필터와 비교 통합 브라우저 동작.
- [x] GREEN: 보완작업 5개 회귀 검증, 접근성/레이아웃 조정, 문서.
- [x] Verify: lint, typecheck, unit, build, desktop/mobile E2E.
- [x] Independent code review; fix reproducible findings with regression tests.
- [x] Commit logical fixes. Push와 원격 CI 결과는 최종 작업 보고에 기록.

## Execution record
- Base: db55082. Working tree clean; origin/dev synchronized.
- Implementing inline as requested; final independent review.

- Final local validation: lint, typecheck, 71 unit/component tests, production build, 26 desktop/mobile Edge E2E passed.
- Independent review: draft-only reset and legacy shower aliases fixed with RED/GREEN regression tests; reviewer confirmed both fixes.
- Added three explicitly fictional demo gyms; existing gym prices/lessons remain unknown.
