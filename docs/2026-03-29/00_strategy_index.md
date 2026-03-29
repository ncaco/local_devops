# SNS 자동화 배포 서비스 전략 문서 인덱스

작성일: 2026-03-29

## 문서 목적

이 묶음은 SNS 자동화 배포 서비스를 제품, 개발, 디자인의 세 축으로 나눠서 정리한 전략 문서 세트다.

각 문서는 독립적으로 읽을 수 있지만, 함께 읽어야 방향이 고정된다.

## 전략 문서

1. [제품/사업 전략](./09_ceo_strategy.md)
2. [개발 전략](./10_engineering_strategy.md)
3. [디자인 전략](./11_design_strategy.md)

## 기존 연계 문서

1. [서비스 기획서](./01_sns_automation_deployment_service_plan.md)
2. [PRD](./02_prd.md)
3. [기술 설계서](./04_technical_design.md)

## 읽는 순서

1. `09_ceo_strategy.md`
2. `02_prd.md`
3. `10_engineering_strategy.md`
4. `04_technical_design.md`
5. `11_design_strategy.md`

## 한 줄 요약

- CEO 관점: 이 서비스는 SNS 관리 툴이 아니라 SNS 배포 운영 시스템이다.
- Eng 관점: 구현의 중심은 화면보다 상태 머신, 게시 오케스트레이션, 어댑터, 복구다.
- Design 관점: UI의 목적은 예쁨이 아니라 운영자의 통제감과 신뢰를 만드는 것이다.

