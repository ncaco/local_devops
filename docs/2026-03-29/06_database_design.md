# SNS 자동화 배포 서비스 데이터베이스 설계서

작성일: 2026-03-29
작성 방식: 데이터 설계 서브에이전트 초안 기반 정리
기준 문서: `AGENT.md`, `01_sns_automation_deployment_service_plan.md`, `02_prd.md`, `04_technical_design.md`, `10_engineering_strategy.md`

## 1. 문서 목적

이 문서는 SNS 자동화 배포 서비스의 데이터 구조를 고정하기 위한 설계서다.

목표는 승인, 예약, 게시, 실패 복구, 감사 추적이 하나의 흐름으로 이어지도록 PostgreSQL 스키마를 일관되게 정의하는 것이다.

이 설계의 우선순위는 다음과 같다.

- 게시 상태와 승인 상태를 명확하게 분리한다.
- 채널별 차이는 데이터 모델이 아니라 어댑터와 정책으로 흡수한다.
- 모든 중요한 행위는 이력으로 남긴다.
- 운영 장애가 나도 상태가 깨지지 않도록 제약과 인덱스를 먼저 설계한다.

## 2. 설계 원칙

### 2.1 명명 원칙

- 테이블명과 컬럼명은 영문 소문자 `snake_case`를 사용한다.
- 약어는 최소화하고, 축약이 필요하면 조직 전체에서 의미가 고정된 것만 쓴다.
- 같은 개념은 항상 같은 이름을 사용한다. 예를 들어 계정은 `account`, 조직은 `organization`, 상태는 `status`로 통일한다.
- 시간 컬럼은 `created_at`, `updated_at`, `deleted_at` 패턴을 따른다.
- 식별자는 `*_id`로 끝낸다.
- 코드값은 `*_cd`, 여부값은 `*_yn` 또는 `is_*` 중 하나로 일관되게 선택한다. 이 문서는 가독성을 위해 `is_*`를 우선한다.
- 주석과 데이터 사전은 한국어로 작성하되, 실제 물리명은 영어로 유지한다.

### 2.2 모델링 원칙

- 하나의 테이블은 하나의 책임만 가진다.
- 상태값은 문자열 하드코딩이 아니라 코드 체계 또는 명시적 enum으로 관리한다.
- 업무 흐름이 있는 테이블은 상태 전환 이력을 별도 테이블에 남긴다.
- 논리 삭제는 기본으로 두지 않고, 필요한 경우에만 `deleted_at`를 둔다.
- 외부 SNS API의 응답 원문은 핵심 테이블에 직접 저장하지 않고, 별도 시도 이력에 저장한다.
- 감사로그는 운영 편의가 아니라 시스템 신뢰의 증거로 취급한다.

### 2.3 표준화 원칙

- 동일한 의미의 데이터는 테이블마다 다른 표현을 쓰지 않는다.
- 조직, 브랜드, 채널, 콘텐츠, 승인, 게시라는 도메인 경계를 유지한다.
- 상태값은 사람이 읽을 수 있으면서도 기계적으로 비교 가능한 코드로 설계한다.
- 날짜와 시간은 모두 UTC 기준 저장을 원칙으로 하고, 표시 시 로컬 타임존으로 변환한다.

## 3. 주요 테이블 목록

| 테이블명 | 역할 |
|---|---|
| `organizations` | 서비스 이용 조직 정보 |
| `brands` | 조직 내 브랜드 정보 |
| `users` | 사용자 계정 정보 |
| `roles` | 역할 정의 |
| `user_roles` | 사용자-역할 매핑 |
| `channel_accounts` | SNS 채널 연결 계정 |
| `content_items` | 게시 대상 콘텐츠 원본 |
| `content_variants` | 플랫폼별 콘텐츠 변형 |
| `approval_requests` | 승인 요청 단위 |
| `approval_actions` | 승인/반려 이력 |
| `publish_jobs` | 실제 게시 작업 |
| `publish_attempts` | 게시 시도 이력 |
| `publish_job_events` | 게시 작업 상태 변경 이력 |
| `notifications` | 알림 발송 이력 |
| `audit_logs` | 감사 로그 |
| `code_values` | 상태/코드 값 기준 테이블 |
| `system_settings` | 조직별 또는 시스템 설정 |

## 4. 핵심 컬럼 설계

### 4.1 `organizations`

- `organization_id` UUID, PK
- `organization_name` varchar, 조직명
- `organization_code` varchar, 조직 식별 코드
- `status` varchar, 활성/비활성 상태
- `created_at` timestamptz
- `updated_at` timestamptz
- `deleted_at` timestamptz nullable

핵심 제약:

- `organization_code`는 전체 유니크
- 삭제는 논리 삭제 우선

### 4.2 `brands`

- `brand_id` UUID, PK
- `organization_id` UUID, FK
- `brand_name` varchar
- `brand_code` varchar
- `status` varchar
- `created_at`, `updated_at`, `deleted_at`

핵심 제약:

- 같은 조직 안에서는 `brand_code` 유니크
- 브랜드는 반드시 조직에 종속

### 4.3 `users`

- `user_id` UUID, PK
- `organization_id` UUID, FK
- `email` varchar, 로그인 식별자
- `display_name` varchar
- `password_hash` varchar
- `status` varchar
- `last_login_at` timestamptz nullable
- `created_at`, `updated_at`, `deleted_at`

핵심 제약:

- `email`은 조직 또는 전역 정책에 따라 유니크
- 비활성 사용자도 이력 조회는 가능해야 함

### 4.4 `channel_accounts`

- `channel_account_id` UUID, PK
- `organization_id` UUID, FK
- `brand_id` UUID, FK nullable
- `channel_type` varchar
- `channel_name` varchar
- `external_account_id` varchar
- `access_token_enc` text
- `refresh_token_enc` text nullable
- `token_expires_at` timestamptz nullable
- `health_status` varchar
- `status` varchar
- `created_at`, `updated_at`, `deleted_at`

핵심 제약:

- 채널 계정은 조직에 종속
- `external_account_id`는 채널별로 유니크
- 토큰 원문은 평문 저장 금지

### 4.5 `content_items`

- `content_item_id` UUID, PK
- `organization_id` UUID, FK
- `brand_id` UUID, FK
- `created_by_user_id` UUID, FK
- `title` varchar
- `body_text` text
- `planned_publish_at` timestamptz nullable
- `content_status` varchar
- `approval_status` varchar
- `priority_cd` varchar
- `created_at`, `updated_at`, `deleted_at`

핵심 제약:

- 콘텐츠 본문과 승인 상태를 분리
- 예약 시각이 없어도 초안은 생성 가능

### 4.6 `content_variants`

- `content_variant_id` UUID, PK
- `content_item_id` UUID, FK
- `channel_type` varchar
- `variant_text` text
- `variant_json` jsonb nullable
- `validation_status` varchar
- `validation_message` text nullable
- `created_at`, `updated_at`

핵심 제약:

- 한 콘텐츠는 채널별 변형을 여러 개 가질 수 있음
- 플랫폼별 규칙 검증 결과를 보존

### 4.7 `approval_requests`

- `approval_request_id` UUID, PK
- `content_item_id` UUID, FK
- `requested_by_user_id` UUID, FK
- `current_status` varchar
- `requested_at` timestamptz
- `approved_at` timestamptz nullable
- `rejected_at` timestamptz nullable
- `created_at`, `updated_at`

핵심 제약:

- 한 콘텐츠에 대해 활성 승인 요청은 중복 생성 제한
- 승인 요청은 게시보다 먼저 존재해야 함

### 4.8 `approval_actions`

- `approval_action_id` UUID, PK
- `approval_request_id` UUID, FK
- `action_type` varchar
- `acted_by_user_id` UUID, FK
- `action_reason` text nullable
- `acted_at` timestamptz
- `created_at`

핵심 제약:

- 승인, 반려, 보류 등의 행위를 이력으로 남김
- 반려 사유는 운영상 필수

### 4.9 `publish_jobs`

- `publish_job_id` UUID, PK
- `content_item_id` UUID, FK
- `brand_id` UUID, FK
- `channel_account_id` UUID, FK
- `scheduled_at` timestamptz
- `job_status` varchar
- `idempotency_key` varchar
- `last_attempt_at` timestamptz nullable
- `succeeded_at` timestamptz nullable
- `failed_at` timestamptz nullable
- `created_at`, `updated_at`

핵심 제약:

- `idempotency_key` 유니크
- 승인 완료 전 생성 불가
- 같은 콘텐츠라도 채널별로 별도 작업 가능

### 4.10 `publish_attempts`

- `publish_attempt_id` UUID, PK
- `publish_job_id` UUID, FK
- `attempt_no` integer
- `attempt_status` varchar
- `request_payload` jsonb nullable
- `response_payload` jsonb nullable
- `error_code` varchar nullable
- `error_message` text nullable
- `started_at` timestamptz
- `finished_at` timestamptz nullable
- `created_at`

핵심 제약:

- 한 작업 내 시도 번호는 중복 불가
- 외부 응답 원문은 이력 테이블에 보관

### 4.11 `publish_job_events`

- `publish_job_event_id` UUID, PK
- `publish_job_id` UUID, FK
- `event_type` varchar
- `from_status` varchar nullable
- `to_status` varchar nullable
- `event_message` text nullable
- `event_payload` jsonb nullable
- `occurred_at` timestamptz

핵심 제약:

- 상태 변경 이력을 순서대로 추적
- 운영자가 장애를 재구성할 수 있어야 함

### 4.12 `notifications`

- `notification_id` UUID, PK
- `organization_id` UUID, FK
- `channel_account_id` UUID, FK nullable
- `notification_type` varchar
- `notification_status` varchar
- `title` varchar
- `message` text
- `sent_at` timestamptz nullable
- `acknowledged_at` timestamptz nullable
- `created_at`, `updated_at`

### 4.13 `audit_logs`

- `audit_log_id` UUID, PK
- `organization_id` UUID, FK
- `actor_user_id` UUID, FK nullable
- `entity_type` varchar
- `entity_id` UUID
- `action_type` varchar
- `before_data` jsonb nullable
- `after_data` jsonb nullable
- `ip_address` inet nullable
- `user_agent` text nullable
- `occurred_at` timestamptz
- `created_at`

### 4.14 `code_values`

- `code_value_id` UUID, PK
- `code_group` varchar
- `code` varchar
- `code_name` varchar
- `sort_order` integer
- `is_active` boolean
- `created_at`, `updated_at`

### 4.15 `system_settings`

- `system_setting_id` UUID, PK
- `organization_id` UUID nullable
- `setting_key` varchar
- `setting_value` jsonb
- `setting_scope` varchar
- `created_at`, `updated_at`

## 5. 관계 구조

```text
organizations 1 ─── N brands
organizations 1 ─── N users
organizations 1 ─── N channel_accounts
brands 1 ─── N content_items
content_items 1 ─── N content_variants
content_items 1 ─── N approval_requests
approval_requests 1 ─── N approval_actions
content_items 1 ─── N publish_jobs
publish_jobs 1 ─── N publish_attempts
publish_jobs 1 ─── N publish_job_events
organizations 1 ─── N notifications
organizations 1 ─── N audit_logs
roles N ─── N users  [user_roles]
```

관계 설계 원칙:

- 조직 단위가 최상위 경계다.
- 브랜드는 조직 내부 분리 단위다.
- 콘텐츠는 브랜드에 종속된다.
- 승인과 게시는 각각 독립 객체로 관리한다.
- 이력 테이블은 본 테이블을 보완하는 구조로 둔다.

## 6. 상태값/코드 설계

### 6.1 공통 상태값

- `ACTIVE`
- `INACTIVE`
- `DELETED`
- `PENDING`
- `COMPLETED`
- `FAILED`

### 6.2 콘텐츠 상태

- `DRAFT`
- `PENDING_APPROVAL`
- `REJECTED`
- `APPROVED`
- `SCHEDULED`
- `PUBLISHING`
- `PUBLISHED`
- `FAILED`

### 6.3 승인 상태

- `REQUESTED`
- `APPROVED`
- `REJECTED`
- `CANCELLED`

### 6.4 게시 작업 상태

- `QUEUED`
- `RUNNING`
- `SUCCEEDED`
- `FAILED`
- `RETRY_SCHEDULED`
- `CANCELLED`

### 6.5 채널 계정 건강 상태

- `HEALTHY`
- `WARNING`
- `UNHEALTHY`
- `EXPIRED`

### 6.6 채널 유형 코드

- `INSTAGRAM`
- `X`
- `FACEBOOK`
- `YOUTUBE`
- `THREADS`
- `ETC`

### 6.7 코드 관리 원칙

- 코드값은 데이터 사전으로 관리한다.
- 화면과 API는 코드값을 직접 노출할 수 있으나, 표현 문자열은 별도 매핑한다.
- 코드 추가는 운영 중에도 가능해야 하며, 하드코딩에 의존하지 않는다.

## 7. 인덱스 전략

### 7.1 기본 인덱스

- 모든 PK는 기본 인덱스
- 모든 FK는 인덱스 생성
- `created_at`, `updated_at`은 운영 조회 패턴에 따라 보조 인덱스 생성

### 7.2 핵심 조회 인덱스

- `content_items (organization_id, brand_id, content_status, planned_publish_at)`
- `approval_requests (content_item_id, current_status, requested_at)`
- `publish_jobs (organization_id, job_status, scheduled_at)`
- `publish_jobs (channel_account_id, job_status, scheduled_at)`
- `publish_attempts (publish_job_id, attempt_no)`
- `audit_logs (organization_id, occurred_at desc)`
- `publish_job_events (publish_job_id, occurred_at asc)`
- `channel_accounts (organization_id, channel_type, status)`
- `content_variants (content_item_id, channel_type)`

### 7.3 유니크 인덱스

- `organizations.organization_code`
- `brands (organization_id, brand_code)`
- `users (organization_id, email)` 또는 전역 정책에 따른 유니크
- `channel_accounts (channel_type, external_account_id)`
- `publish_jobs.idempotency_key`
- `publish_attempts (publish_job_id, attempt_no)`

### 7.4 부분 인덱스 고려

- 활성 상태만 많이 조회하는 테이블은 `deleted_at is null` 조건의 부분 인덱스를 고려한다.
- 대기 상태가 많은 `publish_jobs`, `approval_requests`는 상태별 부분 인덱스를 고려한다.

## 8. 무결성/제약조건

### 8.1 참조 무결성

- 모든 FK는 실제 존재하는 상위 엔티티만 참조한다.
- 조직 경계 외 데이터 접근을 막기 위해 조직 단위 FK 체인을 유지한다.

### 8.2 도메인 무결성

- 승인되지 않은 콘텐츠는 게시 작업을 생성할 수 없다.
- 예약 시각이 과거인 작업은 원칙적으로 금지한다.
- 채널 계정이 `UNHEALTHY` 또는 `EXPIRED`이면 신규 게시를 차단한다.
- 동일 작업의 중복 실행은 `idempotency_key`로 차단한다.

### 8.3 체크 제약

- 상태값은 정의된 코드 집합만 허용한다.
- `attempt_no`는 1 이상의 정수만 허용한다.
- `scheduled_at`은 필수이며, 게시 작업에 따라 nullable로 두지 않는다.
- `action_reason`은 반려 시 필수 입력으로 강제한다.

### 8.4 데이터 품질 제약

- 텍스트 길이와 채널별 글자 수 규칙은 애플리케이션 레벨과 DB 레벨을 함께 적용한다.
- 첨부 에셋 수, 예약 시간, 계정 상태는 업무 규칙 기준으로 검증한다.

## 9. 감사로그와 이력 보존 전략

### 9.1 감사로그 원칙

- 승인, 반려, 예약, 게시, 재시도, 계정 재연결, 설정 변경은 모두 `audit_logs`에 기록한다.
- 감사로그는 수정하지 않는다.
- 감사로그는 운영자뿐 아니라 보안과 장애 분석의 핵심 데이터다.

### 9.2 이력 보존

- `publish_attempts`, `publish_job_events`, `approval_actions`는 삭제하지 않고 누적 보존한다.
- 게시 실패 응답 원문은 재현 가능성이 있으므로 일정 기간 보관한다.
- 민감한 토큰 원문은 절대 저장하지 않는다. 필요 시 암호화된 형태만 유지한다.

### 9.3 보존 정책

- 운영 이력은 장기 보존한다.
- 대용량 테이블은 월 단위 파티셔닝 또는 아카이빙을 고려한다.
- 감사로그는 읽기 최적화보다 무결성을 우선한다.

## 10. 확장 고려사항

### 10.1 파티셔닝

- `audit_logs`, `publish_attempts`, `publish_job_events`는 데이터량이 급격히 증가하므로 시간 기준 파티셔닝을 검토한다.
- 일정 기간 이후 조회 빈도가 낮은 이력은 별도 아카이브 테이블로 이관할 수 있도록 설계한다.

### 10.2 멀티테넌시 확장

- 현재는 조직 단위 분리를 기준으로 하되, 향후 계층형 테넌시가 필요할 경우 `parent_organization_id` 확장을 고려한다.
- 모든 주요 테이블에 `organization_id`를 유지해 테넌시 확장을 쉽게 만든다.

### 10.3 코드 확장

- 채널 유형, 상태 코드, 알림 유형은 새 채널 추가를 고려해 확장형 코드 구조를 유지한다.
- 하드코딩된 enum에 묶이지 않도록 코드 테이블과 앱 코드의 경계를 분리한다.

### 10.4 검색과 리포팅

- 운영 화면 검색이 많아지면 전문 검색 인덱스나 집계 테이블을 추가할 수 있다.
- 분석 리포트가 커지면 OLTP와 읽기 전용 집계를 분리하는 방향으로 확장한다.

### 10.5 데이터 마이그레이션

- 스키마 변경은 backward-compatible 하게 설계한다.
- 컬럼 추가 후 쓰기, 읽기 전환, 제거의 3단계 배포를 기본 원칙으로 한다.
- 기존 데이터 이관이 필요한 경우에는 백필 작업과 검증 쿼리를 별도로 둔다.

## 결론

이 데이터베이스는 단순 저장소가 아니라 운영 시스템의 신뢰 계층이다.

따라서 스키마는 CRUD 편의보다 상태의 명확성, 이력의 완전성, 장애 복구 가능성을 우선해야 한다.

이 설계를 기준으로 구현하면 승인, 예약, 게시, 실패 복구, 감사 추적이 같은 데이터 모델 위에서 움직인다.

그게 이 서비스의 코어다.

