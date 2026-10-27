# local_devops

인스타그램 게시물 예약 발행을 위한 MVP와 저비용 배포 구조를 정리한 저장소입니다. Next.js 화면에서 채널 연결과 예약 게시물을 관리하고, FastAPI가 인증·예약·발행 요청을 처리합니다.

## 구성

| 경로 | 내용 |
| --- | --- |
| [frontend](frontend/README.md) | Next.js 화면, Supabase 인증 및 개발용 인증 |
| [backend](backend/README.md) | FastAPI API, 인스타그램 연결 및 예약 게시물 처리 |
| [database](database/README.md) | Supabase PostgreSQL 초기 스키마 |
| [docs/devops-architecture.md](docs/devops-architecture.md) | 배포 구조와 비용 계획. 작성 시점의 가격이므로 현재 요금은 제공업체에서 확인 |

## 로컬 실행

Python과 Node.js를 설치한 뒤 두 터미널에서 각각 실행합니다. 아래 명령은 저장소 루트에서 시작하며, 기존 환경 파일은 덮어쓰지 않습니다.

백엔드:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
test -e .env || cp .env.example .env
uvicorn app.main:app --reload
```

프런트엔드:

```bash
cd frontend
npm ci
test -e .env.local || cp .env.example .env.local
npm run dev
```

Windows에서는 `source .venv/bin/activate` 대신 PowerShell의 `.\.venv\Scripts\Activate.ps1`을 사용하고, 환경 파일 복사는 기존 파일을 확인한 후 수행합니다.

- 화면: <http://localhost:3000>
- API 상태: <http://localhost:8000/health>
- API 문서: <http://localhost:8000/docs>

기본 예시는 로컬 SQLite와 개발용 인증, 모의 발행을 사용합니다. Supabase 인증 및 실제 Instagram 연결에는 별도 설정이 필요합니다. 개발용 인증과 모의 설정을 그대로 공개 서버에 사용하지 마세요. 환경 파일과 API 비밀값은 커밋하지 않습니다. 특히 백엔드에는 환경 파일 무시 설정이 있는지 확인한 뒤 작업하세요.

예약된 게시물은 별도 호출 없이 자동 발행되는 것으로 가정하지 마세요. 발행 처리는 내부 작업 엔드포인트와 실행 주체의 연결이 필요합니다. 상세 설정은 각 디렉터리의 문서를 참고하세요.
