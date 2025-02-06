package com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "category")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer categoryId;

    @Column(nullable = false, length = 20)
    private String categoryName;

    @OneToMany(mappedBy = "category")
    private List<Cosmetic> cosmetics = new ArrayList<>();
}
