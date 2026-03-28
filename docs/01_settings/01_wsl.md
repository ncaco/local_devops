# WSL

## 구성 및 설치순서
1. wsl 설치 및 업데이트
2. pip 설치 및 업데이트
3. docker 저장소 위치(D:) 변경
4?. caddy 설치 ( *.server.local 형태로 구성함 )
4. portainer 설치 ( caddy 뒤로 9443 포트로 설정하는데 중복될수있으니까 -> 19443 으로 구성함 )
5. postgresql 설치 ( 내부 5432 포트에 설정 및 생성됨 )
5. Gitea 설치 ( caddy 뒤로 3000 포트로 설정하는데 중복될수있으니까 -> 13000 으로 구성함 )
6. ragistry 설치 ( caddy 뒤로 5000 포트로 설정하는데 중복될수있으니까 -> 15000 으로 구성함 )
7. runner 설치


---

## 보안 관련
1. 내부전용
 - portainer
 - gitea
 - registry
 - runner

2. 내부/외부 혼용
 - 개발 배포 (port:2****)
 - DNS , IP , SSL 적용 

3. 외부전용
 - 운영 배포 (port:3****)
 - DNS , IP , SSL 적용 


