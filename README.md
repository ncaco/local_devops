# SNS 자동화 배포 서비스

문서와 실행형 스캐폴딩을 함께 관리하는 저장소입니다.

## 구조

- `docs/2026-03-29/`
  제품, 전략, UX, API, DB, 운영, 테스트 문서 세트
- `frontend/`
  Next.js 공식 `create-next-app` 기반 프론트엔드 기본 프로젝트
- `backend/`
  `uv` 기반 FastAPI 서버 골격 + Alembic 마이그레이션 소유
- `database/`
  Docker PostgreSQL + seed 구성
- `DESIGN.md`
  프론트엔드 디자인 시스템 소스

## 실행 순서

1. `database/`에서 PostgreSQL 실행
2. `backend/`에서 Alembic 마이그레이션 적용
3. `backend/` 실행
4. `frontend/` 실행

루트 PowerShell 스크립트로도 바로 실행할 수 있습니다.

```powershell
.\start-database.ps1
.\start-backend.ps1
.\start-frontend.ps1
```

PostgreSQL 비밀번호가 기존 Docker 볼륨과 맞지 않으면 아래 스크립트로 로컬 DB를 초기화할 수 있습니다.

```powershell
.\reset-database.ps1
```

## 로컬 포트

- Frontend: `13000`
- Backend: `18000`
- PostgreSQL: `15432`

## 문서 인덱스

- [전략 인덱스](./docs/2026-03-29/00_strategy_index.md)
- [서비스 기획서](./docs/2026-03-29/01_sns_automation_deployment_service_plan.md)
- [PRD](./docs/2026-03-29/02_prd.md)
- [정보구조](./docs/2026-03-29/03_information_architecture.md)
- [기술 설계](./docs/2026-03-29/04_technical_design.md)
- [API 명세](./docs/2026-03-29/05_api_spec.md)
- [DB 설계](./docs/2026-03-29/06_database_design.md)
- [배포/운영 전략](./docs/2026-03-29/07_deployment_operations.md)
- [테스트 전략](./docs/2026-03-29/08_test_strategy.md)
- [CEO 전략](./docs/2026-03-29/09_ceo_strategy.md)
- [Eng 전략](./docs/2026-03-29/10_engineering_strategy.md)
- [Design 전략](./docs/2026-03-29/11_design_strategy.md)
