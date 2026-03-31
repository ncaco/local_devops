# 저비용 DevOps 아키텍처

## 개요

초기 소규모 서비스 기준으로 가장 현실적인 조합은 `Vercel + Render + Supabase Postgres`입니다.  
프론트는 정적 자산과 SSR 배포가 쉬운 `Vercel`, 백엔드는 운영 부담이 낮은 `Render`, 데이터베이스는 직접 운영하지 않는 관리형 Postgres를 권장합니다.

## 권장 구성

### 1. Frontend

- 플랫폼: `Vercel`
- 앱: `Next.js`
- 역할: 정적 페이지, SSR, API 호출 프록시가 필요하면 BFF 레이어 일부 수용
- 장점: Git 연동 자동 배포, HTTPS, Preview 환경 기본 제공

### 2. Backend

- 플랫폼: `Render Web Service` 또는 `Railway`
- 앱: `FastAPI`
- 역할: 비즈니스 로직, 인증 검증, DB 접근, 외부 API 연동
- 최소 요구사항:
  - `/health` 헬스체크 엔드포인트
  - `CORS` 허용 도메인 관리
  - 환경변수 기반 설정

### 3. Database

- 플랫폼: `Supabase Postgres` 또는 `Neon`
- 엔진: `PostgreSQL`
- 역할: 운영 데이터 저장
- 권장 사항:
  - 앱과 DB는 같은 리전 사용
  - 마이그레이션 도구는 `Alembic` 사용
  - 자동 백업/스냅샷 기능 사용

### 4. DNS / SSL / 네트워크

- 플랫폼: `Cloudflare`
- 역할: DNS 관리, SSL, 기본 보안 보호
- 권장:
  - `app.example.com` -> Vercel
  - `api.example.com` -> Render 또는 Railway

## 배포 흐름

### 프론트엔드

1. GitHub `main` 브랜치에 머지
2. `Vercel`이 자동 빌드 및 배포
3. Preview 배포는 PR마다 자동 생성

### 백엔드

1. GitHub `main` 브랜치에 머지
2. `Render` 또는 `Railway`가 자동 배포
3. 배포 직후 `/health` 확인
4. 필요 시 DB 마이그레이션 실행

## 환경변수 기준

### Frontend

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_ENV`

### Backend

- `APP_ENV`
- `DATABASE_URL`
- `SECRET_KEY`
- `CORS_ORIGINS`
- `SENTRY_DSN` (선택)

## 운영 기준

- 로그: 플랫폼 기본 로그 사용
- 에러 추적: `Sentry` 권장
- 모니터링: 헬스체크, 5xx 비율, DB 용량만 우선 관리
- 인증: 직접 구현보다 `Supabase Auth` 또는 `Clerk` 권장

## 비용 절감 원칙

- 쿠버네티스 사용 금지
- Redis, 메시지 큐, 오브젝트 스토리지는 실제 필요 전까지 도입 보류
- 단일 백엔드 서비스로 시작
- 스테이징 환경은 Preview 배포로 대체하고 별도 상시 서버는 두지 않음

## 플랫폼별 기본 비용 기준

아래 값은 `2026-03-31` 기준 공식 가격 페이지를 바탕으로 정리한 시작점입니다. 실제 청구액은 리전, 트래픽, 로그 보관, 초과 사용량에 따라 달라집니다.

### Frontend / Edge

- `Vercel Hobby`: 무료
- `Vercel Pro`: `월 $20`부터
- `Cloudflare Free`: DNS, SSL, CDN 기본 기능 무료

### Backend

- `Render Hobby workspace`: `월 $0/user` + compute 비용
- `Render Web Service Starter`: `월 $7`
- `Render Web Service Standard`: `월 $25`
- `Railway Free`: `월 $0`, 무료 체험 후 `월 $1`
- `Railway Hobby`: `월 $5 minimum usage`
- `Railway Pro`: `월 $20 minimum usage`

### Database

- `Supabase Free`: 무료
- `Supabase Pro`: `월 $25`
- `Neon Free`: 무료
- `Neon`: 사용량 기반 과금

## 사용량 단계별 예상 비용

아래 수치는 일반 CRUD SaaS 기준의 보수적 추정입니다.  
가정:

- 활성 사용자 1명당 월 `15~40` 페이지뷰
- 세션당 API 호출 `10~30`회
- 파일 업로드와 대용량 미디어 전송은 제외

### 1. 출시 직후

- 규모: `MAU 1,000`, 페이지뷰 `1.5만~4만`, API 호출 `5만~20만`, 트래픽 `10~30GB`
- 최저 비용 조합: `Vercel Hobby + Railway Hobby + Neon Free/Launch`
- 예상 비용: `월 $5~15`
- 안정형 조합: `Vercel Pro + Render Starter + Supabase Pro`
- 예상 비용: `월 $52~60`

### 2. 초기 유료 운영

- 규모: `MAU 10,000`, 페이지뷰 `15만~40만`, API 호출 `50만~200만`, 트래픽 `80~200GB`
- 최저 비용 조합: `Vercel Pro + Railway Hobby/Pro + Neon Launch`
- 예상 비용: `월 $20~60`
- 안정형 조합: `Vercel Pro + Render Starter + Supabase Pro`
- 예상 비용: `월 $52~75`

### 3. 성장 초기

- 규모: `MAU 50,000`, 페이지뷰 `75만~200만`, API 호출 `250만~1,000만`, 트래픽 `300~700GB`
- 비용 절감형 조합: `Vercel Pro + Railway Pro + Neon`
- 예상 비용: `월 $70~180`
- 예측 가능한 조합: `Vercel Pro + Render Standard + Supabase Pro`
- 예상 비용: `월 $70~140`

### 4. 본격 운영

- 규모: `MAU 100,000+`, 페이지뷰 `150만~400만`, API 호출 `500만~2,000만`, 트래픽 `600GB~1.5TB`
- 예상 비용 범위: `월 $120~300+`
- 이 구간부터는 초과 대역폭, DB egress, Auth MAU, 워커 분리가 청구액을 크게 좌우함

## 비용이 커지는 지점

### Vercel

- `Pro`는 `월 $20`부터 시작
- 데이터 전송량이 커지면 `1TB` 포함량 이후 추가 비용 발생
- Functions, Image Optimization, Edge 요청 수가 많아지면 별도 과금 가능

### Render

- 서비스 인스턴스 크기 업그레이드가 가장 큰 비용 요인
- `Starter $7`에서 부족하면 `Standard $25`, 이후 `Pro $85`로 증가
- DB를 Render Postgres로 직접 운영하면 앱 서버보다 DB 비용이 더 빨리 커질 수 있음

### Railway

- CPU, 메모리, 볼륨, egress가 모두 usage-based
- 유휴 시간이 많은 서비스는 저렴하지만, 상시 부하가 있으면 예측이 어려워질 수 있음

### Supabase

- `Pro`는 `월 $25`
- egress, Auth MAU, DB 디스크 증가에 따라 추가 요금 발생
- 사용자 수가 많아지면 Auth 과금이 먼저 눈에 띄는 경우가 많음

### Neon

- 사용량 기반 과금이라 초기에는 매우 저렴할 수 있음
- scale-to-zero와 compute limit 설정 여부가 체감 비용에 큰 영향을 줌

## 추천 비용 전략

- 예산 `월 $20 이하`: `Vercel Hobby + Railway Hobby + Neon Free/Launch`
- 예산 `월 $50~80`: `Vercel Pro + Render Starter + Supabase Pro`
- 예산 `월 $100 이상`: `Vercel Pro + Render Standard + Supabase Pro`, 필요 시 `Cloudflare R2` 추가

운영 난이도와 비용 예측 가능성을 함께 보면, 첫 production 조합으로는 `Vercel Pro + Render Starter + Supabase Pro`가 가장 무난합니다.

## 확장 시점

다음 조건이 생기면 구성을 확장합니다.

- 파일 업로드 증가: `Cloudflare R2` 추가
- 백그라운드 작업 증가: `Render Cron Job` 또는 워커 분리
- 트래픽 증가: API/Worker 분리, 캐시 계층 추가
- 다운타임 민감도 증가: 블루-그린 또는 롤링 배포 검토

## 구현 체크리스트

- GitHub 조직/저장소 생성
- Vercel 프로젝트 연결
- Render 또는 Railway 서비스 생성
- Supabase 또는 Neon DB 생성
- Cloudflare 도메인 연결
- 환경변수 표준 확정
- CI에서 빌드/테스트 자동화
- 헬스체크 및 에러 추적 연결

## 참고 링크

- Vercel Pricing: <https://vercel.com/pricing>
- Vercel Pricing Docs: <https://vercel.com/docs/pricing>
- Render Pricing: <https://render.com/pricing>
- Railway Pricing: <https://railway.com/pricing>
- Supabase Billing: <https://supabase.com/docs/guides/platform/billing-on-supabase>
- Neon Pricing: <https://neon.com/pricing>
- Cloudflare Plans: <https://www.cloudflare.com/plans/>
- Cloudflare R2 Pricing: <https://developers.cloudflare.com/r2/pricing/>
- GitHub Actions Billing: <https://docs.github.com/en/billing/concepts/product-billing/github-actions>
