# Database Skeleton

Docker PostgreSQL and seed assets for the SNS automation deployment service.

## Quick Start

1. Copy `.env.example` to `.env`.
2. Start Postgres with Docker Compose.
3. Run migrations from `../backend`.
4. Load the seed data with `psql "$DATABASE_URL_PSQL" -f sql/seed.sql`.

```bash
docker compose up -d
cd ../backend
uv sync
uv run alembic upgrade head
cd ../database
psql "$env:DATABASE_URL_PSQL" -f sql/seed.sql
```

## Layout

- `docker-compose.yml`: local PostgreSQL service
- `.env.example`: local environment variables
- `sql/seed.sql`: seed data for local development

## Notes

- Schema migrations are owned by `backend/alembic`.
- Seed data is intentionally small and only exists to make the mock UI and API useful in local development.
