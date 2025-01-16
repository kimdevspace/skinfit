### Spring CRUD 연습 코드 (Maven 환경)
- pom.xml (Spring Boot 프로젝트를 구성하기 위한 설정 파일)
```
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">

    <!-- Maven POM 파일의 구조 정의 버전으로, 일반적으로 4.0.0을 사용 -->
    <modelVersion>4.0.0</modelVersion>

    <!-- 스프링 부트 프로젝트의 부모 설정, 기본적으로 제공하는 여러 플러그인, 의존성 버전 등을 편리하게 관리-->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.4.1</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <!-- 프로젝트 식별 정보 -->
    <groupId>com.example</groupId>
    <artifactId>demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>demo</name>
    <description>Demo project for Spring Boot</description>

    <!--라이센스, 개발자, scm 정보-->
    <url/>
    <licenses>
        <license/>
    </licenses>
    <developers>
        <developer/>
    </developers>
    <scm>
        <connection/>
        <developerConnection/>
        <tag/>
        <url/>
    </scm>

    <!--프로퍼티, 자바 버전을 지정해 줌-->
    <properties>
        <java.version>17</java.version>
    </properties>

    <!--의존성 관리-->
    <dependencies>
        <!--
        pring MVC와 Tomcat(내장 서버) 등을 포함한 웹 애플리케이션 개발 필수 라이브러리들을 제공
        REST API를 개발하거나 웹 애플리케이션을 만드는 경우 가장 기본적으로 추가해야 하는 의존성
        -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!--
        Lombok 라이브러리는 자바 코드에서 반복되는
        getter/setter, toString, equalsAndHashCode 등을 자동 생성해주는
        어노테이션을 제공
        <optional>true</optional> 로 설정해 두어 최종 빌드에서 Lombok을 필수 의존성으로 포함시키지 않도록
        -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!--
        스프링 부트에서 제공하는 테스트에 관련된 라이브러리( JUnit, Mockito, AssertJ 등)를
        통합한 스타터입니다.
        <scope>test</scope> 로 설정하여, 실제 애플리케이션에서는 사용되지 않고 테스트 시에만 로드
        -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

        <!--
        Spring JDBC 관련 핵심 라이브러리입니다.
        데이터베이스에 접근하기 위해 JDBC를 사용할 때 필요한 의존성들을 포함
        -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jdbc</artifactId>
        </dependency>


        <!-- MariaDB 데이터베이스에 연결하기 위한 JDBC 드라이버 -->
        <dependency>
            <groupId>org.mariadb.jdbc</groupId>
            <artifactId>mariadb-java-client</artifactId>
        </dependency>

        <!--Spring Data JPA 라이브러리로, JPA를 사용하여 데이터베이스를 다룰 수 있게-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <!--
            자바 코드를 컴파일할 때 사용할 컴파일러 설정
            annotationProcessorPaths를 지정하면, Lombok 어노테이션 프로세서가 동작하도록 설정
            -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <annotationProcessorPaths>
                        <path>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </path>
                    </annotationProcessorPaths>
                </configuration>
            </plugin>

            <!--
            스프링 부트 애플리케이션을 패키징하고 실행할 수 있도록 도와주는 플러그인
            <excludes> 내에서 lombok을 빌드 결과물에서 제외하도록 설정함으로써,
            최종 산출물(JAR, WAR) 크기를 줄일 수 있음
            -->
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>

        </plugins>
    </build>

</project>

```

- application.properties(Spring Boot 애플리케이션의 동작 방식을 결정)
```
# 애플리케이션 이름
spring.application.name=demo

# 데이터베이스 접속 정보
spring.datasource.url=jdbc:mariadb://localhost:3306/test
spring.datasource.username=root
spring.datasource.password=1234
# MariaDB JDBC 드라이버
spring.datasource.driver-class-name=org.mariadb.jdbc.Driver

# JPA(Hibernate) 설정
# 테이블 자동 생성 / 업데이트 모드 설정
spring.jpa.hibernate.ddl-auto=update
# 실행되는 SQL 쿼리 로깅
spring.jpa.show-sql=true
# Hibernate Dialect 지정
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MariaDBDialect
```

- model/User.java (JPA 엔티티 클래스, 데이터베이스 테이블과 매칭되는 user 클래스)

```
package com.example.demo.model;

// JPA 관련 어노테이션 임포트
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

// @Entity: 해당 클래스가 JPA 엔티티 클래스임을 나타냄
// @Table(name = "user"): 이 엔티티가 매핑될 DB 테이블명을 지정
@Entity
@Table(name = "user")
public class User {

    // @Id: 기본 키(Primary Key) 필드
    // @GeneratedValue(strategy = GenerationType.IDENTITY): 
    // DB의 auto_increment 기능을 사용하여 값이 자동으로 증가하도록 지정
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 일반 컬럼
    private String name;
    private String email;

    // 기본 생성자(파라미터 없는 생성자)는 JPA에서 필수
    public User() {}

    // 모든 필드를 포함한 생성자 (필요에 따라 오버로딩)
    public User(Long id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    // Getter/Setter 메서드
    // private 필드에 접근하기 위해 필요함
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
}

```

- contoller/UserController.java (UserController는 사용자 관련 REST API 엔드포인트를 정의하고, 들어오는 요청을 받아 UserService를 통해 처리한 뒤 적절한 응답을 반환하는 역할)
```
package com.example.demo.controller;

// import 구문
import com.example.demo.model.User;
import com.example.demo.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

// @RestController: 해당 클래스가 REST API의 컨트롤러 역할을 한다고 선언
// @RequestMapping: 해당 클래스에서 다루는 API 경로를 지정 (/api/users)
@RestController
@RequestMapping("/api/users")
public class UserController {

    // UserService를 주입받아 사용자 관련 비즈니스 로직을 처리
    private final UserService userService;

    // 생성자를 이용한 의존성 주입
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * [GET] /api/users
     * 모든 사용자 조회
     * @return 전체 사용자 리스트
     */
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        // UserService를 통해 모든 User 객체를 가져옴
        List<User> users = userService.getAllUsers();
        // 200 OK 상태 코드와 함께 데이터 반환
        return ResponseEntity.ok(users);
    }

    /**
     * [GET] /api/users/{id}
     * 특정 ID를 가진 사용자 조회
     * @param id 조회할 사용자의 ID
     * @return 해당 사용자의 정보 또는 404 Not Found
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        // ID로 사용자 조회 (Optional 타입으로 받아 null 처리 가능)
        Optional<User> userOpt = userService.getUserById(id);
        // 해당 사용자 정보가 존재하면 200 OK, 없으면 404 Not Found
        return userOpt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * [POST] /api/users
     * 새로운 사용자 추가
     * @param user 새로 추가할 사용자의 정보
     * @return 추가된 사용자 정보
     */
    @PostMapping
    public ResponseEntity<User> addUser(@RequestBody User user) {
        // 클라이언트가 전송한 User 객체를 DB에 저장
        User createdUser = userService.addUser(user);
        // 생성된 사용자 정보를 200 OK 상태로 반환
        return ResponseEntity.ok(createdUser);
    }

    /**
     * [PUT] /api/users/{id}
     * 특정 사용자의 정보 수정
     * @param id 수정할 사용자의 ID
     * @param user 수정에 사용될 사용자 정보 (Request Body)
     * @return 수정된 사용자 정보
     */
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        // Request Body로 들어온 user 객체에 URL 경로로 전달된 id 값 설정
        user.setId(id);  // setId 메서드를 통해 ID 값 할당
        User updatedUser = userService.updateUser(user);
        // 수정된 사용자 정보를 200 OK 상태로 반환
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * [DELETE] /api/users/{id}
     * 특정 사용자를 삭제
     * @param id 삭제할 사용자의 ID
     * @return 결과에 대한 상태 코드 (No Content)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        // ID로 사용자 삭제
        userService.deleteUser(id);
        // 삭제 후에는 204 No Content 상태 코드 반환
        return ResponseEntity.noContent().build();
    }
}

```

- service/UserService.java (UserService는 비즈니스 로직을 담당하는 계층(서비스 계층)며,UserRepository를 통해 실제 데이터베이스 조회/저장/삭제 등의 작업을 수행)
```
package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * @Service: 스프링이 해당 클래스를 서비스 계층(비즈니스 로직 처리 계층)으로 인식하게 함
 */
@Service
public class UserService {

    // UserRepository를 주입받아 DB에 접근할 수 있게 함
    private final UserRepository userRepository;

    /**
     * 생성자를 이용한 의존성 주입.
     * 스프링이 UserRepository의 구현체를 자동으로 주입함.
     */
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * 모든 사용자 조회
     * @return 데이터베이스에 저장된 모든 User 리스트
     */
    public List<User> getAllUsers() {
        // findAll() 메서드를 통해 전체 User 데이터를 조회
        return userRepository.findAll();
    }

    /**
     * ID로 사용자 조회
     * @param id 조회할 User의 식별자(ID)
     * @return 존재하면 Optional<User> 객체, 없으면 Optional.empty()
     */
    public Optional<User> getUserById(Long id) {
        // findById() 메서드로 특정 ID의 User 데이터를 조회
        return userRepository.findById(id);
    }

    /**
     * 사용자 추가
     * @param user 새로 추가할 User 객체
     * @return 저장된 User 객체
     */
    public User addUser(User user) {
        // save() 메서드를 통해 User 객체를 DB에 저장
        return userRepository.save(user);
    }

    /**
     * 사용자 정보 수정
     * @param user 수정할 정보를 담은 User 객체
     * @return 수정된 User 객체
     */
    public User updateUser(User user) {
        // save() 메서드는 id가 존재할 경우 Update, 존재하지 않을 경우 Insert를 수행
        return userRepository.save(user);
    }

    /**
     * 사용자 삭제
     * @param id 삭제할 User의 ID
     */
    public void deleteUser(Long id) {
        // deleteById() 메서드로 DB에서 해당 ID의 User 데이터를 삭제
        userRepository.deleteById(id);
    }
}

```
- repository/UserRepository.java
```
package com.example.demo.repository;

import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // 기본적인 CRUD 메서드는 JpaRepository에서 제공
    // 추가적인 쿼리 메서드를 정의할 수 있습니다.
    // UserControll에서 Repo 선언 후 사용
}

```
- DemoApplication.java
```
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}
}
```