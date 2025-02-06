package com.ssafy12.moinsoop.skinfit.domain.skintype.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "skin_type")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SkinType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer typeId;

    @Column(nullable = false, length = 50)
    private String typeName;

    @OneToMany(mappedBy = "skinType")
    private List<UserSkinType> userSkinTypes = new ArrayList<>();
}
