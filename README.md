# local_devops

`Next.js + FastAPI + PostgreSQL` 조합을 저비용으로 운영하기 위한 DevOps 설계 문서 저장소입니다.

## 문서

- `AGENTS.md`: 저장소 작업 규칙
- `docs/devops-architecture.md`: 추천 인프라 구성, 배포 흐름, 환경변수, 운영 체크리스트, 사용량 단계별 비용 가이드

## 권장 기본 구성

- Frontend: `Vercel`
- Backend API: `Render` 또는 `Railway`
- Database: `Supabase Postgres` 또는 `Neon`
- DNS / SSL: `Cloudflare`
- Source / CI: `GitHub` + `GitHub Actions`

## 목표

- 초기 비용 최소화
- 운영 복잡도 최소화
- 소규모 CRUD 서비스에 적합한 구조 확보
- 추후 파일 저장, 배치 작업, 캐시 계층을 무리 없이 확장 가능하게 설계

## 다음 단계

1. `docs/devops-architecture.md` 기준으로 서비스 조합 확정
2. 실제 애플리케이션 저장소 구조 생성
3. 환경변수 템플릿과 CI/CD 설정 추가
