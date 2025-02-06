package com.ssafy12.moinsoop.skinfit.domain.experience.entity;

import com.ssafy12.moinsoop.skinfit.domain.ingredient.entity.Ingredient;
import com.ssafy12.moinsoop.skinfit.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ingredient_experience")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class IngredientExperience {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer ingredientExperienceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ingredient_id", nullable = false)
    private Ingredient ingredient;

    @Column(nullable = false)
    private boolean isSuitable;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "ingredientExperience")
    private List<IngredientSymptom> ingredientSymptoms = new ArrayList<>();
}