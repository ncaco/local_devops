# SNS 자동화 배포 서비스 기술 설계서

작성일: 2026-03-29
연관 문서: `01_sns_automation_deployment_service_plan.md`, `02_prd.md`

## 1. 설계 목표

이 설계의 목적은 SNS 콘텐츠를 "작성"하는 시스템이 아니라 "신뢰성 있게 배포"하는 시스템을 만드는 것이다.

따라서 설계 우선순위는 다음과 같다.

- 승인 없는 게시 방지
- 게시 실패의 즉시 가시화
- 재시도 가능한 작업 구조
- 채널별 API 차이를 어댑터 계층으로 격리
- 이력과 감사 추적 보장

## 2. 기술 스택 기준

- Frontend: Next.js
- Frontend 구조: FSD 아키텍처
- Backend: FastAPI on Python, `uv` 기반 의존성 관리
- Database: PostgreSQL
- Local DB: Docker PostgreSQL
- Dev Frontend: Vercel
- Dev Backend/DB: Railway
- Prod: AWS

## 3. 시스템 구성

```text
[Next.js Admin]
  |
  v
[FastAPI API Layer]
  |
  +--> [Auth / RBAC]
  +--> [Content Service]
  +--> [Approval Service]
  +--> [Publish Orchestrator]
  +--> [Channel Adapter Registry]
  +--> [Audit Log Service]
  +--> [Notification Service]
  |
  v
[PostgreSQL]

[Scheduler]
  |
  v
[Publish Job Dispatcher]
  |
  v
[Worker]
  |
  v
[Channel Adapter]
  |
  v
[External SNS APIs]
```

## 4. 아키텍처 원칙

### 4.1 서비스 경계

- API Layer: 요청 검증, 인증, 응답 포맷 표준화
- Domain Service Layer: 비즈니스 규칙 처리
- Orchestration Layer: 게시 실행 순서와 상태 전환 제어
- Adapter Layer: 외부 SNS API 통신 전담
- Persistence Layer: 데이터 저장 및 조회

### 4.2 핵심 원칙

- 채널별 로직은 코어 서비스에 직접 섞지 않는다.
- 상태 전환은 명시적이어야 한다.
- 게시는 비동기 작업으로 처리한다.
- 외부 API 실패는 표준 에러 모델로 변환한다.
- 모든 작업은 idempotent 해야 한다.

## 5. 핵심 도메인

### 5.1 엔티티

- `organizations`
- `brands`
- `users`
- `roles`
- `channel_accounts`
- `content_items`
- `content_variants`
- `approval_requests`
- `publish_jobs`
- `publish_attempts`
- `audit_logs`
- `notifications`

### 5.2 도메인 책임

- ContentItem: 원본 콘텐츠와 예약 메타데이터 보유
- ContentVariant: 플랫폼별 최종 게시 버전
- ApprovalRequest: 승인 단계와 상태 관리
- PublishJob: 게시 실행 단위
- PublishAttempt: 각 게시 시도별 결과 보존
- ChannelAccount: 토큰, 권한 상태, 채널 메타정보 관리

## 6. 게시 파이프라인

```text
[콘텐츠 작성]
  -> [유효성 검증]
  -> [승인 요청]
  -> [승인 완료]
  -> [예약 시각 도달]
  -> [PublishJob 생성]
  -> [Worker 할당]
  -> [Channel Adapter 실행]
  -> [결과 저장]
  -> [성공 또는 재시도]
```

## 7. 데이터 흐름

### 7.1 Happy Path

```text
Client
  -> API
  -> Content Service
  -> Approval Service
  -> Scheduler
  -> Publish Orchestrator
  -> Channel Adapter
  -> External SNS
  -> Result Persistence
  -> Dashboard
```

### 7.2 Shadow Path

```text
입력 없음(nil)
  -> 저장 차단
  -> 검증 오류 반환

입력은 있으나 비어 있음(empty)
  -> 규칙 위반으로 승인 요청 차단

외부 API 실패(error)
  -> 표준 에러 코드 변환
  -> PublishAttempt 저장
  -> 재시도 정책 판단

토큰 만료(auth)
  -> 계정 상태 비정상 마킹
  -> 운영자 알림
  -> 해당 계정 후속 작업 보류
```

## 8. 상태 머신

### 8.1 콘텐츠 상태

```text
DRAFT
  -> PENDING_APPROVAL
  -> REJECTED
  -> APPROVED
  -> SCHEDULED
  -> PUBLISHING
  -> PUBLISHED
  -> FAILED
```

제약:

- `DRAFT` 에서만 수정 가능
- `APPROVED` 이전에는 실제 게시 불가
- `PUBLISHING` 상태에서 중복 실행 불가

### 8.2 게시 작업 상태

```text
QUEUED
  -> RUNNING
  -> SUCCEEDED
  -> FAILED
  -> RETRY_SCHEDULED
  -> CANCELLED
```

제약:

- 하나의 작업은 하나의 활성 실행만 가진다.
- `SUCCEEDED` 이후 재실행은 새 작업으로만 가능하다.

## 9. 백엔드 모듈 설계

### 9.1 권장 모듈

- `app/api`
- `app/core`
- `app/domain/content`
- `app/domain/approval`
- `app/domain/publish`
- `app/domain/channel`
- `app/domain/audit`
- `app/workers`
- `app/adapters/channels`
- `app/repositories`

### 9.2 책임 분리 예시

- `content_service`: 콘텐츠 생성, 검증, 예약 수정
- `approval_service`: 승인 요청, 승인, 반려, 이력 기록
- `publish_orchestrator`: 게시 실행, 상태 전환, 재시도 예약
- `channel_adapter_registry`: 채널 유형별 어댑터 선택
- `audit_log_service`: 모든 중요한 이벤트 기록

## 10. 채널 어댑터 패턴

### 10.1 인터페이스 개념

모든 채널 어댑터는 공통 인터페이스를 구현한다.

```text
validate_payload(content_variant, channel_account)
publish(content_variant, channel_account)
check_account_health(channel_account)
normalize_error(raw_error)
```

### 10.2 어댑터 책임

- 플랫폼별 길이/형식 제약 검증
- 외부 API 요청/응답 처리
- 플랫폼 특화 에러를 내부 표준 에러로 변환
- 계정 상태 이상 감지

## 11. 에러 모델

### 11.1 표준 에러 타입

- `ValidationError`
- `ApprovalRequiredError`
- `ChannelAccountExpiredError`
- `RateLimitError`
- `TemporaryPublishError`
- `PermanentPublishError`
- `DuplicateExecutionError`
- `UnauthorizedActionError`

### 11.2 에러 처리 원칙

- 사용자 입력 오류는 즉시 반환
- 외부 API 일시 실패는 재시도
- 외부 API 영구 실패는 수동 조치 대상으로 전환
- 알 수 없는 예외는 내부 오류로 저장하되 문맥 로그를 남긴다

## 12. 재시도 정책

### 12.1 재시도 대상

- 타임아웃
- 일시적 네트워크 오류
- 외부 API 5xx
- 제한 시간 내 복구 가능한 rate limit

### 12.2 재시도 제외

- 권한 만료
- 승인 미완료
- payload 검증 실패
- 삭제된 계정

### 12.3 재시도 방식

- 지수 백오프
- 최대 재시도 횟수 제한
- 재시도 시도별 `publish_attempts` 저장

## 13. 보안 설계

- SNS 토큰은 암호화 저장
- 역할 기반 접근 제어 적용
- 조직/브랜드 단위 데이터 접근 제한
- 감사로그는 수정 불가 정책 권장
- 운영자 액션은 주요 이벤트마다 기록

## 14. 관측성 설계

### 14.1 로그

- 요청 단위 trace id
- 게시 작업 id
- 외부 채널명
- 실패 코드 및 정규화 메시지

### 14.2 메트릭

- 채널별 게시 성공률
- 작업 대기열 길이
- 평균 게시 소요 시간
- 실패 유형별 건수
- 자동 재시도 회복률

### 14.3 알림

- 채널 계정 토큰 만료 임박
- 게시 실패 임계치 초과
- 큐 적체

## 15. 프론트엔드 구조 제안

### 15.1 FSD 기준 슬라이스

- `app`
- `pages`
- `widgets`
- `features`
- `entities`
- `shared`

### 15.2 주요 feature 예시

- `feature/create-content`
- `feature/request-approval`
- `feature/approve-content`
- `feature/retry-publish`
- `feature/manage-channel-account`

## 16. API 설계 방향

### 16.1 주요 엔드포인트 범주

- 인증
- 조직/브랜드
- 채널 계정
- 콘텐츠
- 승인
- 게시 작업
- 운영 대시보드

### 16.2 설계 원칙

- 상태 변경 API는 명시적 동사 기반 액션 허용
- 조회와 상태 전환을 분리
- 게시 재시도는 별도 액션 엔드포인트로 처리

## 17. 배포 설계

### 17.1 환경 분리

- Local: 개발자 생산성 우선
- Dev: 통합 검증 우선
- Prod: 안정성, 보안, 관측성 우선

### 17.2 권장 구성

```text
Local
  Next.js + FastAPI + Docker PostgreSQL

Dev
  Vercel FE + Railway API + Railway PostgreSQL

Prod
  AWS FE + AWS API + AWS Managed PostgreSQL
```

## 18. 장애 시나리오

### 시나리오 A. 외부 SNS API timeout

- 작업 상태를 `FAILED` 또는 `RETRY_SCHEDULED` 로 전환
- 재시도 가능 여부 판단
- 운영 대시보드 반영

### 시나리오 B. 토큰 만료

- 채널 계정 상태를 `UNHEALTHY` 로 마킹
- 후속 게시 작업 차단
- 관리자 알림 발송

### 시나리오 C. 중복 작업 실행

- idempotency key 검사
- 중복이면 기존 결과 참조 또는 차단

## 19. 테스트 전략 연결 포인트

- 채널 어댑터 단위 테스트
- 승인/반려 상태 전환 테스트
- 예약 시각 기반 작업 생성 테스트
- 재시도 정책 테스트
- 멀티 브랜드 권한 분리 테스트

## 20. 구현 우선순위

### 1단계

- 인증/권한
- 콘텐츠/승인 모델
- 게시 작업 모델

### 2단계

- 스케줄러
- 워커
- 채널 어댑터 2종

### 3단계

- 운영 대시보드
- 알림
- 운영 도구

## 21. 기술 설계 결론

이 시스템은 CRUD 중심 백오피스가 아니라 상태와 작업이 핵심인 운영 시스템이다.

그래서 구현의 중심도 화면보다 상태 머신, 게시 오케스트레이션, 채널 어댑터, 감사로그가 되어야 한다.

이 축이 안정적이면 채널 추가와 AI 기능 확장은 어렵지 않다.
