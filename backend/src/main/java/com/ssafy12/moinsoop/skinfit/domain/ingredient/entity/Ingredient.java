package com.ssafy12.moinsoop.skinfit.domain.ingredient.entity;

import com.ssafy12.moinsoop.skinfit.domain.cosmetic_ingredient.entity.CosmeticIngredient;
import com.ssafy12.moinsoop.skinfit.domain.experience.entity.IngredientExperience;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ingredient")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer ingredientId;

    @Column(nullable = false, length = 200)
    private String ingredientName;

    @Column(length = 200)
    private String engName;

    private Integer ewgScoreMin;

    private Integer ewgScoreMax;

    @Column(nullable = false)
    private boolean status;

    @OneToMany(mappedBy = "ingredient")
    private List<CosmeticIngredient> cosmeticIngredients = new ArrayList<>();

    @OneToMany(mappedBy = "ingredient")
    private List<IngredientExperience> ingredientExperiences = new ArrayList<>();
}
