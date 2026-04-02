# frontend

Next.js frontend for the Instagram scheduling MVP.

## What changed

- Supabase Auth based sign-in shell
- Backend-driven Instagram connect flow
- Scheduled post form for `image + caption`
- Queue/status dashboard for scheduled, published, failed, canceled posts

## Env

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_DEV_USER_ID=00000000-0000-0000-0000-000000000001
NEXT_PUBLIC_DEV_USER_EMAIL=dev@local.test
```

If Supabase values are empty, the UI uses development headers to talk to the backend.

## Run

```bash
npm install
npm run dev
```

## MVP flow

1. Sign in with Supabase or use development auth fallback
2. Connect Instagram through the backend OAuth start endpoint
3. Create a scheduled post with one image URL and a caption
4. Let the backend worker publish due jobs
5. Check the queue panel for status and execution history
