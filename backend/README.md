# local_devops backend

FastAPI backend for the Instagram scheduling MVP.

## Run

```bash
python -m pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Required env

```env
APP_ENV=development
DATABASE_URL=sqlite:///./local_devops.db
FRONTEND_APP_URL=http://localhost:3000
INTERNAL_JOB_TOKEN=change-me
INSTAGRAM_APP_ID=
INSTAGRAM_APP_SECRET=
INSTAGRAM_REDIRECT_URI=http://localhost:8000/integrations/instagram/callback
INSTAGRAM_SCOPES=instagram_business_basic,instagram_business_content_publish
SUPABASE_URL=
SUPABASE_ANON_KEY=
ENABLE_DEV_AUTH=true
MOCK_INSTAGRAM_PUBLISH=true
```

## Token policy

- `env`에는 Instagram 앱 공통 설정만 둡니다.
- 사용자별 채널 OAuth 토큰은 `env`에 두지 않습니다.
- 채널 연결 후 받은 access token은 DB의 `social_accounts`에 저장합니다.
- 다중채널 구조에서는 채널 수가 늘어나도 `env`를 늘리지 않고 DB 레코드만 추가됩니다.

If `SUPABASE_URL` and `SUPABASE_ANON_KEY` are not configured, the backend falls back to
development auth headers so the app can still be exercised locally.
