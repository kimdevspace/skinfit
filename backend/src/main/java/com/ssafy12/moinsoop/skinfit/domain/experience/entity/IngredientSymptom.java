package com.ssafy12.moinsoop.skinfit.domain.experience.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ingredient_symptom")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class IngredientSymptom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer ingredientSymptomId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ingredient_experience_id", nullable = false)
    private IngredientExperience ingredientExperience;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "symptom_id", nullable = false)
    private Symptom symptom;
}