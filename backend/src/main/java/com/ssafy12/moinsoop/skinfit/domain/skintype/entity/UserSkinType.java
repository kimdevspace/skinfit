package com.ssafy12.moinsoop.skinfit.domain.skintype.entity;

import com.ssafy12.moinsoop.skinfit.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_skin_type")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserSkinType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userSkinTypeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_id", nullable = false)
    private SkinType skinType;
}
