package com.ssafy12.moinsoop.skinfit.domain.experience.entity;

import com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.Cosmetic;
import com.ssafy12.moinsoop.skinfit.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "product_experience")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProductExperience {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer productExperienceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cosmetic_id", nullable = false)
    private Cosmetic cosmetic;

    @Column(nullable = false)
    private boolean isSuitable;

    @OneToMany(mappedBy = "productExperience")
    private List<ProductSymptom> productSymptoms = new ArrayList<>();
}