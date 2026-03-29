# SNS 자동화 배포 서비스 API 명세

작성일: 2026-03-29
작성 방식: API 설계 서브에이전트 초안 기반 정리
기준 문서: `AGENT.md`, `01_sns_automation_deployment_service_plan.md`, `02_prd.md`, `04_technical_design.md`, `10_engineering_strategy.md`

## 1. 문서 목적

이 문서는 SNS 자동화 배포 서비스의 백엔드 API를 구현하기 위한 기준이다.

콘텐츠 작성, 승인, 예약, 게시, 실패 복구, 운영 대시보드 조회까지의 흐름을 일관된 REST API로 정의한다.

이 API의 핵심 목적은 다음이다.

- 승인 없는 게시를 서버에서 차단한다.
- 채널별 차이를 어댑터 계층 뒤로 숨긴다.
- 게시 작업과 재시도를 idempotent 하게 만든다.
- 운영자가 실패 원인과 현재 상태를 빠르게 파악할 수 있게 한다.

## 2. 공통 규칙

- Base URL은 `/api/v1`로 한다.
- 요청과 응답은 기본적으로 `application/json`을 사용한다.
- 인증은 `Authorization: Bearer <access_token>` 헤더를 사용한다.
- 시간은 모두 UTC ISO 8601 형식으로 반환한다. 예: `2026-03-29T09:00:00Z`
- 모든 리스트 API는 `page`, `page_size`, `sort`를 지원한다.
- 모든 상태 변경 요청은 서버에서 최종 검증한다. 프론트 검증만 믿지 않는다.
- 재시도 가능 작업에는 `Idempotency-Key` 헤더를 지원한다.
- `request_id`는 모든 응답에 포함한다. 로그 추적용이다.
- 삭제는 기본적으로 soft delete 또는 비활성화로 처리한다.
- 에러 응답 형식은 섹션 10을 따른다.

### 공통 응답 예시

```json
{
  "request_id": "req_01HTX7Q2M3",
  "data": {
    "id": "org_001",
    "name": "마케팅본부"
  }
}
```

## 3. 인증/권한 API

### 3.1 로그인

`POST /auth/login`

요청 예시:

```json
{
  "email": "admin@example.com",
  "password": "secret-password"
}
```

응답 예시:

```json
{
  "request_id": "req_01HTX7Q2M3",
  "data": {
    "access_token": "eyJhbGciOi...",
    "refresh_token": "eyJhbGciOi...",
    "token_type": "Bearer",
    "expires_in": 3600,
    "user": {
      "id": "usr_001",
      "name": "홍길동",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

### 3.2 토큰 갱신

`POST /auth/refresh`

요청 예시:

```json
{
  "refresh_token": "eyJhbGciOi..."
}
```

### 3.3 현재 사용자 조회

`GET /auth/me`

응답 예시:

```json
{
  "request_id": "req_01HTX7Q2M3",
  "data": {
    "id": "usr_001",
    "name": "홍길동",
    "email": "admin@example.com",
    "role": "approver",
    "organization_ids": ["org_001"]
  }
}
```

### 3.4 로그아웃

`POST /auth/logout`

- access token 무효화 또는 refresh token 폐기 정책을 적용한다.

### 3.5 권한 규칙

- `admin`: 조직 설정, 사용자 권한, 채널 계정 연결 가능
- `operator`: 콘텐츠 작성, 승인 요청, 실패 재시도 가능
- `approver`: 승인, 반려 가능
- `viewer`: 조회 전용

## 4. 조직/브랜드 API

### 4.1 조직 목록

`GET /organizations`

### 4.2 조직 생성

`POST /organizations`

요청 예시:

```json
{
  "name": "마케팅본부",
  "code": "marketing-hq"
}
```

### 4.3 조직 상세

`GET /organizations/{organization_id}`

### 4.4 브랜드 목록

`GET /organizations/{organization_id}/brands`

### 4.5 브랜드 생성

`POST /organizations/{organization_id}/brands`

요청 예시:

```json
{
  "name": "브랜드 A",
  "code": "brand-a",
  "timezone": "Asia/Seoul"
}
```

### 4.6 브랜드 수정

`PATCH /brands/{brand_id}`

### 4.7 브랜드 비활성화

`POST /brands/{brand_id}/disable`

- 게시 중인 예약 작업이 있으면 비활성화 전에 차단 정책을 적용한다.

## 5. 채널 계정 API

### 5.1 채널 계정 목록

`GET /brands/{brand_id}/channel-accounts`

응답에는 채널명, 연결 상태, 토큰 상태, 마지막 점검 시각을 포함한다.

### 5.2 채널 계정 연결 시작

`POST /brands/{brand_id}/channel-accounts`

요청 예시:

```json
{
  "channel": "instagram",
  "display_name": "브랜드 A 인스타그램"
}
```

응답 예시:

```json
{
  "request_id": "req_01HTX7Q2M3",
  "data": {
    "id": "cha_001",
    "channel": "instagram",
    "connect_url": "https://sns.example.com/oauth/start/cha_001",
    "status": "pending_connect"
  }
}
```

### 5.3 OAuth 콜백 처리

`GET /channel-accounts/{channel_account_id}/callback`

- 외부 SNS OAuth callback을 처리한다.
- state 검증 실패 시 `400` 또는 `403` 반환.

### 5.4 연결 상태 확인

`GET /channel-accounts/{channel_account_id}`

### 5.5 연결 해제

`POST /channel-accounts/{channel_account_id}/disconnect`

### 5.6 건강 상태 점검

`POST /channel-accounts/{channel_account_id}/health-check`

응답 예시:

```json
{
  "request_id": "req_01HTX7Q2M3",
  "data": {
    "status": "healthy",
    "last_checked_at": "2026-03-29T09:00:00Z",
    "issues": []
  }
}
```

## 6. 콘텐츠 API

### 6.1 콘텐츠 목록

`GET /brands/{brand_id}/contents`

지원 필터:

- `status`
- `channel`
- `approval_status`
- `scheduled_from`
- `scheduled_to`

### 6.2 콘텐츠 생성

`POST /brands/{brand_id}/contents`

요청 예시:

```json
{
  "title": "4월 캠페인 공지",
  "body": "새로운 이벤트를 시작합니다.",
  "scheduled_at": "2026-04-01T02:00:00Z",
  "channel_ids": ["cha_001", "cha_002"]
}
```

### 6.3 콘텐츠 상세

`GET /contents/{content_id}`

### 6.4 콘텐츠 수정

`PATCH /contents/{content_id}`

- 상태가 `PUBLISHED` 또는 `PUBLISHING`이면 수정 불가다.
- 승인 요청 후 수정 가능 여부는 정책으로 제한한다.

### 6.5 콘텐츠 삭제

`DELETE /contents/{content_id}`

- 실제 삭제 대신 `archived` 또는 `deleted` 상태로 처리할 수 있다.

### 6.6 콘텐츠 유효성 검사

`POST /contents/{content_id}/validate`

응답 예시:

```json
{
  "request_id": "req_01HTX7Q2M3",
  "data": {
    "valid": false,
    "errors": [
      {
        "field": "body",
        "code": "TEXT_TOO_LONG",
        "message": "X 채널 허용 길이를 초과했습니다."
      }
    ]
  }
}
```

### 6.7 게시 예약

`POST /contents/{content_id}/schedule`

요청 예시:

```json
{
  "scheduled_at": "2026-04-01T02:00:00Z"
}
```

### 6.8 콘텐츠 상태 전이 예시

- `draft -> pending_approval`
- `pending_approval -> approved`
- `approved -> scheduled`
- `scheduled -> publishing`
- `publishing -> published`
- `publishing -> failed`

## 7. 승인 API

### 7.1 승인 요청 생성

`POST /contents/{content_id}/approval-requests`

요청 예시:

```json
{
  "message": "캠페인 게시 승인 요청드립니다."
}
```

### 7.2 승인 요청 목록

`GET /organizations/{organization_id}/approval-requests`

지원 필터:

- `status=pending|approved|rejected`
- `brand_id`
- `approver_id`

### 7.3 승인 요청 상세

`GET /approval-requests/{approval_request_id}`

### 7.4 승인

`POST /approval-requests/{approval_request_id}/approve`

요청 예시:

```json
{
  "comment": "문안 확인 완료"
}
```

### 7.5 반려

`POST /approval-requests/{approval_request_id}/reject`

요청 예시:

```json
{
  "reason": "브랜드 톤과 맞지 않음"
}
```

### 7.6 승인 이력

`GET /contents/{content_id}/approvals`

- 승인자, 승인 시각, 반려 사유, 이력 변경을 모두 포함한다.

## 8. 게시 작업 API

### 8.1 게시 작업 목록

`GET /brands/{brand_id}/publish-jobs`

지원 필터:

- `status`
- `channel`
- `scheduled_from`
- `scheduled_to`
- `content_id`

### 8.2 게시 작업 상세

`GET /publish-jobs/{publish_job_id}`

응답 예시:

```json
{
  "request_id": "req_01HTX7Q2M3",
  "data": {
    "id": "job_001",
    "content_id": "cnt_001",
    "status": "failed",
    "scheduled_at": "2026-04-01T02:00:00Z",
    "attempt_count": 2,
    "last_error": {
      "code": "CHANNEL_RATE_LIMIT",
      "message": "외부 API 호출 제한에 도달했습니다."
    }
  }
}
```

### 8.3 게시 작업 재시도

`POST /publish-jobs/{publish_job_id}/retry`

요청 예시:

```json
{
  "reason": "외부 API 제한 해제 후 재시도"
}
```

### 8.4 게시 작업 취소

`POST /publish-jobs/{publish_job_id}/cancel`

- 아직 실행 전인 `queued` 또는 `scheduled` 상태에서만 허용한다.

### 8.5 수동 재게시

`POST /publish-jobs/{publish_job_id}/republish`

- 기존 실패 건을 새 작업으로 복제해서 다시 실행할 때 사용한다.
- 이 작업은 반드시 권한과 감사로그를 남긴다.

### 8.6 게시 작업 상태 예시

- `queued`
- `running`
- `succeeded`
- `failed`
- `retry_scheduled`
- `cancelled`

## 9. 대시보드 API

### 9.1 운영 대시보드 요약

`GET /dashboard/overview?organization_id=org_001&brand_id=brand_001`

응답 예시:

```json
{
  "request_id": "req_01HTX7Q2M3",
  "data": {
    "pending_approvals": 4,
    "scheduled_posts": 7,
    "failed_jobs": 2,
    "healthy_accounts": 5,
    "unhealthy_accounts": 1
  }
}
```

### 9.2 실패 작업 요약

`GET /dashboard/failures?organization_id=org_001`

### 9.3 최근 작업 타임라인

`GET /dashboard/timeline?brand_id=brand_001`

### 9.4 계정 상태 요약

`GET /dashboard/channel-health?brand_id=brand_001`

### 9.5 KPI 요약

`GET /dashboard/kpis?organization_id=org_001`

포함 항목:

- 예약 게시 성공률
- 실패 탐지 평균 시간
- 재시도 회복률
- 수동 개입 비율

## 10. 에러 응답 규격

모든 에러는 같은 envelope를 사용한다.

### 에러 응답 형식

```json
{
  "request_id": "req_01HTX7Q2M3",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력값이 올바르지 않습니다.",
    "details": [
      {
        "field": "scheduled_at",
        "code": "INVALID_DATETIME",
        "message": "예약 시각 형식이 잘못되었습니다."
      }
    ]
  }
}
```

### 공통 에러 코드

- `UNAUTHORIZED`
- `FORBIDDEN`
- `NOT_FOUND`
- `VALIDATION_ERROR`
- `CONFLICT`
- `RATE_LIMITED`
- `CHANNEL_UNAVAILABLE`
- `INTERNAL_ERROR`

### 상태 코드 기준

- `400`: 입력 형식 오류
- `401`: 인증 실패
- `403`: 권한 부족
- `404`: 리소스 없음
- `409`: 상태 충돌, 중복 요청, idempotency conflict
- `422`: 비즈니스 검증 실패
- `429`: 요청 제한 초과
- `500`: 내부 오류

### 에러 예시

```json
{
  "request_id": "req_01HTX7Q2M3",
  "error": {
    "code": "FORBIDDEN",
    "message": "승인 권한이 없습니다."
  }
}
```

### 에러 처리 원칙

- 메시지는 사용자에게 설명 가능해야 한다.
- 내부 스택 트레이스는 반환하지 않는다.
- `details`는 필드 단위 검증에만 사용한다.
- 외부 SNS API 오류는 내부 표준 코드로 매핑한다.

## 11. 웹훅 또는 비동기 이벤트 고려사항

이 서비스는 게시 작업과 외부 SNS 연동이 비동기 흐름을 강하게 가진다.

따라서 웹훅 또는 이벤트 기반 통지는 처음부터 고려해야 한다.

### 11.1 내부 이벤트

다음 이벤트를 발행할 수 있다.

- `content.created`
- `content.approval_requested`
- `content.approved`
- `content.rejected`
- `publish_job.queued`
- `publish_job.running`
- `publish_job.succeeded`
- `publish_job.failed`
- `channel_account.unhealthy`

### 11.2 웹훅 정책

- 웹훅은 at-least-once 전달을 기본으로 한다.
- 각 이벤트에는 `event_id`, `event_type`, `occurred_at`, `resource_id`를 포함한다.
- 수신 측은 idempotency 처리가 필요하다.
- 서명 검증용 `webhook_secret`을 사용한다.

### 11.3 웹훅 예시

```json
{
  "event_id": "evt_001",
  "event_type": "publish_job.failed",
  "occurred_at": "2026-03-29T09:00:00Z",
  "data": {
    "publish_job_id": "job_001",
    "brand_id": "brand_001",
    "error_code": "CHANNEL_RATE_LIMIT"
  }
}
```

### 11.4 재전송 정책

- 실패한 웹훅은 지수 백오프로 재시도한다.
- 최대 재시도 횟수를 초과하면 dead-letter 상태로 보낸다.
- 운영자가 재처리할 수 있는 관리 API를 둔다.

### 11.5 SSE 또는 실시간 갱신 고려

- 운영 대시보드는 웹훅뿐 아니라 SSE 또는 WebSocket 기반 실시간 갱신으로 확장 가능해야 한다.
- 최소 구현은 polling으로 시작하고, 운영 성숙도에 따라 스트리밍으로 전환한다.

### 11.6 비동기 이벤트 소비 원칙

- 이벤트 처리는 중복 수신을 전제로 한다.
- 이벤트 저장과 상태 반영은 분리할 수 있어야 한다.
- 게시 작업 상태는 이벤트 기반이더라도 최종 진실은 DB에 둔다.

