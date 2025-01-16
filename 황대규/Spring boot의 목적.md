### Spring Boot의 목적

Spring Boot는 Spring Framework를 기반으로 한 프로젝트로, 복잡한 설정을 최소화하고, 신속하게 독립 실행형 애플리케이션을 개발할 수 있도록 돕습니다.

주요 특징은

자동 구성(Auto-Configuration) : 애플리케이션의 요구에 따라 필요한 설정을 자동으로 적용

의존성 관리(Dependency Management) : Spring Boot 스타터(Starter)를 통해 필요한 의존성을 쉽게 추가

독립 실행형(JAR) : 별도의 서버 없이도 독립 실행형 JAR 파일로 애플리케이션을 배포 가능

운영 환경에 최적화 : 내장된 서버(Tomcat, Jetty, Undertow)와 모니터링, 메트릭 수집 등의 기능 제공


Spring Boot를 통한 프로젝트 설계 구조는 다음과 같습니다.
```
demo
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com
│   │   │       └── example
│   │   │           └── demo
│   │   │               ├── DemoApplication.java
│   │   │               ├── controller
│   │   │               │   └── UserController.java
│   │   │               ├── model
│   │   │               │   └── User.java
│   │   │               ├── repository
│   │   │               │   └── UserRepository.java
│   │   │               ├── service
│   │   │               │   └── UserService.java
│   │   └── resources
│   │       └── application.properties
│   └── test
│       └── java
│           └── com
│               └── example
│                   └── demo
│                       └── DemoApplicationTests.java
├── pom.xml
└── README.md
```
controller : REST API 엔드포인트를 정의하는 클래스.

model : 데이터베이스 테이블과 매핑되는 엔티티 클래스.

repository : 데이터베이스와 상호작용하는 인터페이스.

service : 비즈니스 로직을 처리하는 클래스.

resources : 설정 파일, 정적 리소스, 템플릿 등을 포함.