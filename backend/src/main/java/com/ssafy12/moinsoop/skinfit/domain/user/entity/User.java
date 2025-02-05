package com.ssafy12.moinsoop.skinfit.domain.user.entity;

import com.ssafy12.moinsoop.skinfit.domain.user.entity.enums.Gender;
import com.ssafy12.moinsoop.skinfit.domain.user.entity.enums.ProviderType;
import com.ssafy12.moinsoop.skinfit.domain.user.entity.enums.RoleType;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.Year;

@Entity
@Table(name = "user")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "user_email", nullable = false, length = 100, unique = true)
    private String userEmail;

    @Column(name = "user_password", nullable = false, length = 100)
    private String userPassword;

    @Column(name = "is_registered", nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private boolean isRegistered;

    @Column(nullable = false, length = 50)
    private String nickname;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "birth_year")
    private Year birthYear;

    @Column(name = "created_at", nullable = false,
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false,
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "role_type", nullable = false,
            columnDefinition = "VARCHAR(10) CHECK (role_type IN ('USER', 'ADMIN')) DEFAULT 'USER'")
    private RoleType roleType;

    @Enumerated(EnumType.STRING)
    @Column(name = "provider_type", nullable = false,
            columnDefinition = "VARCHAR(10) CHECK (provider_type IN ('LOCAL', 'KAKAO')) DEFAULT 'LOCAL'")
    private ProviderType providerType;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Builder
    public User(String userEmail, String userPassword, String nickname,
                Gender gender, Year birthYear, ProviderType providerType,
                RoleType roleType, boolean isRegistered) {
        this.userEmail = userEmail;
        this.userPassword = userPassword;
        this.nickname = nickname;
        this.gender = gender;
        this.birthYear = birthYear;
        this.isRegistered = isRegistered;
        this.roleType = roleType != null ? roleType : RoleType.USER;
        this.providerType = providerType != null ? providerType : ProviderType.LOCAL;
    }

    // 비밀번호 업데이트 메서드 추가
    public void updatePassword(String encodedPassword) {
        this.userPassword = encodedPassword;
    }
}