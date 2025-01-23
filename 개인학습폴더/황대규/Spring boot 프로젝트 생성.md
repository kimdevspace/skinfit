### Spring Boot 프로젝트 생성
https://start.spring.io/

사이트에 접속하게 될 경우 아래와 같이 나오는


프로젝트 메타데이터 설정

Project: Maven Project 또는 Gradle Project (Maven을 권장)

Language: Java

Spring Boot: 최신 안정화 버전 선택 (예: 3.4.1)

Project Metadata:

Group: com.example

Artifact: demo

Name: demo

Description: Demo project for Spring Boot

Package name: 기본값 유지 (com.example.demo)

Packaging: Jar

Java: 17 (현재 사용 중인 버전)

​

ADD Defendencies를 통해 아래와 같은 의존성을 추가할 수 있습니다.

Spring Web: REST API 개발을 위한 의존성

Spring Data JPA: 데이터베이스 연동을 위한 JPA

MariaDB Driver: MariaDB JDBC 드라이버

Lombok: 보일러플레이트 코드를 줄이기 위한 라이브러리

Spring Boot DevTools (선택 사항): 개발 편의 기능

​

프로젝트 생성 및 다운로드

Generate 버튼 클릭하여 ZIP 파일 다운로드

다운로드한 ZIP 파일을 원하는 디렉토리에 압축 해제

​

이후 IDE에서 프로젝트를 설정합니다

IntelliJ IDEA 예시:

프로젝트 열기

File > Open... 선택 후, 압축 해제한 프로젝트 디렉토리 선택.

Maven 프로젝트 동기화

pom.xml 파일을 열면, IntelliJ가 자동으로 Maven 프로젝트를 동기화합니다.

동기화가 완료될 때까지 기다립니다.

Lombok 플러그인 설치 및 활성화

File > Settings > Plugins로 이동

Lombok 검색 후 설치

IDE 재시작

Settings > Build, Execution, Deployment > Compiler > Annotation Processors로 이동

Enable annotation processing 체크