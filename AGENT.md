# SNS 자동화 배포 서비스

## 기본
 - 답변은 무조건 한국어로 합니다.
 - 진행 시 문서는 docs 하위에 오늘날짜(yyyy-mm-dd) 를 만들고 그 하위에 마크다운(.md)로 작성하세요.

## 사양
- frontend
 - nextjs 프레임워크 기반 fsd 아키텍처 구조
 - 개발서버는 vercel 사용
 - 운영서버는 aws 사용

- backend
 - uv 기반 fastapi 최신 LTS 안정화 버전
 - 로컬 
 - 개발서버는 lailway 사용
 - 운영서버는 aws 사용

- database
 - docker 기반 postgresql 최신 LTS 안정화 버전
 - 명명규칙은 대한민국 표준화 지침을 준수
 - 개발서버는 lailway 사용
 - 운영서버는 aws 사용

- default
 - 로컬 포트는 1**** 으로 구성
 - 개발 포트는 2**** 으로 구성
 - 운영 포트는 3**** 으로 구성