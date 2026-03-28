# WSL

WSL은 사내 DevOps 표준 환경의 시작점입니다.

상위 방향은 [사내 DevOps 청사진](C:\dev\git\ncaco97\2026\local_devops\docs\00_strategy\01_internal_devops_blueprint.md)을 기준으로 봅니다.

## 구성 및 설치 순서

1. WSL 설치 및 업데이트
2. Python/PIP 설치 및 업데이트
3. Docker 데이터 저장소 위치를 `D:`로 변경
4. Caddy 설치
5. Portainer 설치
6. PostgreSQL 설치
7. Gitea 설치
8. Registry 설치
9. Runner 설치

## 기본 포트 정책

| 서비스 | 기본 포트 | 내부 표준안 |
|--------|-----------|-------------|
| Caddy | 80 / 443 | 표준 유지 |
| Portainer | 9443 | `19443` |
| PostgreSQL | 5432 | 내부 표준 유지 |
| Gitea | 3000 | `13000` |
| Registry | 5000 | `15000` |

로컬 충돌을 피하려고 포트를 바꾸는 건 괜찮습니다.

다만 그때그때 바꾸면 금방 기억 싸움이 됩니다. 포트는 개인 선택이 아니라 팀 규칙으로 굳혀야 합니다.

---

## 보안 관련

### 내부 전용

- Portainer
- Gitea
- Registry
- Runner

### 내부/외부 혼용

- 개발 배포
- 포트 대역: `2xxxx`
- DNS, IP, SSL 정책 별도 적용

### 외부 전용

- 운영 배포
- 포트 대역: `3xxxx`
- DNS, IP, SSL 정책 별도 적용


