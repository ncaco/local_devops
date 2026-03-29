# Backend

## 실행

```bash
uv sync
uv run alembic upgrade head
uv run uvicorn app.main:app --reload --port 14000
```

마이그레이션은 `backend/`가 소유합니다. 로컬 PostgreSQL은 루트의 `database/` Docker Compose로 먼저 실행합니다.

## 마이그레이션

```bash
uv run alembic current
uv run alembic upgrade head
uv run alembic downgrade -1
```

## 엔드포인트

- `GET /health`
- `GET /ready`
- `GET /api/v1/dashboard/overview`
- `GET /api/v1/approvals`
- `GET /api/v1/failures`
