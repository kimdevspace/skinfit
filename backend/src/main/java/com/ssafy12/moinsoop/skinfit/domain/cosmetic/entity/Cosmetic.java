package com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity;

import com.ssafy12.moinsoop.skinfit.domain.cosmetic_ingredient.entity.CosmeticIngredient;
import com.ssafy12.moinsoop.skinfit.domain.experience.entity.ProductExperience;
import com.ssafy12.moinsoop.skinfit.domain.review.entity.Review;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cosmetic")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Cosmetic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cosmeticId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false, length = 50)
    private String cosmeticName;

    @Column(length = 50)
    private String cosmeticBrand;

    private Integer cosmeticVolume;

    @Column(nullable = false)
    private boolean status;

    @Column(length = 200)
    private String imageUrl;

    @OneToMany(mappedBy = "cosmetic")
    private List<Review> reviews = new ArrayList<>();

    @OneToMany(mappedBy = "cosmetic")
    private List<CosmeticIngredient> cosmeticIngredients = new ArrayList<>();

    @OneToMany(mappedBy = "cosmetic")
    private List<ProductExperience> productExperiences = new ArrayList<>();
}
