# local_devops

이 저장소에는 현재 `Next.js` 기반의 간단한 Instagram OAuth 예제가 포함되어 있습니다. 목적은 Meta App 설정이 끝난 뒤, 가장 작은 형태로 로그인 시작, 콜백 처리, 토큰 교환, 기본 프로필 조회 흐름을 확인하는 것입니다.

## 포함 내용

- `app/`: Next.js App Router 기반 화면 및 API 라우트
- `lib/instagram.ts`: Instagram OAuth URL 생성, 토큰 교환, 프로필 조회 유틸
- `.env.example`: 로컬 실행용 환경변수 예시
- `docs/devops-architecture.md`: 기존 DevOps 설계 문서

## 실행 방법

1. 의존성 설치

```bash
npm install
```

2. 환경변수 파일 생성

```bash
cp .env.example .env.local
```

3. `.env.local` 수정

```env
INSTAGRAM_APP_ID=your_instagram_app_id
INSTAGRAM_APP_SECRET=your_instagram_app_secret
INSTAGRAM_REDIRECT_URI=http://localhost:3000/api/auth/instagram/callback
INSTAGRAM_SCOPES=instagram_business_basic
```

4. 개발 서버 실행

```bash
npm run dev
```

5. 브라우저에서 `http://localhost:3000` 접속

## OAuth 흐름

1. 홈에서 `Continue with Instagram` 클릭
2. `/api/auth/instagram`에서 `state` 쿠키 생성 후 Instagram 권한 페이지로 리다이렉트
3. Meta가 `INSTAGRAM_REDIRECT_URI`로 `code`와 `state`를 반환
4. `/api/auth/instagram/callback`에서 `code`를 액세스 토큰으로 교환
5. `graph.instagram.com/me` 호출로 기본 프로필 확인
6. `/result`에서 결과 payload 출력

## Meta 설정 메모

- Redirect URI는 정확히 `INSTAGRAM_REDIRECT_URI`와 일치해야 합니다.
- 2024년 12월 4일 이후 기존 Instagram Basic Display API는 종료된 것으로 반복 확인되어, 이 예제는 그 이전 방식이 아니라 현재 Instagram Login/Graph API 흐름을 기준으로 작성했습니다.
- 실제 사용 계정은 보통 Instagram Professional 계정과 Meta App 권한 설정이 필요합니다.

## 명령어

- `npm run dev`: 로컬 개발 서버 실행
- `npm run build`: 프로덕션 빌드
- `npm run start`: 빌드 결과 실행
- `npm run typecheck`: TypeScript 타입 검사

## 주의사항

- 액세스 토큰은 예제처럼 화면에 그대로 노출하지 말고, 실제 서비스에서는 서버 저장소에 안전하게 보관해야 합니다.
- 필요한 권한만 요청하세요.
- 실서비스 전에는 장기 토큰 교환, 토큰 갱신, 사용자 저장 로직을 추가하는 편이 안전합니다.
