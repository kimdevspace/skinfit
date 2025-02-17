package com.ssafy12.moinsoop.skinfit.domain.cosmetic_ingredient.entity;

import com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.Cosmetic;
import com.ssafy12.moinsoop.skinfit.domain.ingredient.entity.Ingredient;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cosmetic_ingredient")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CosmeticIngredient {
    @EmbeddedId
    private CosmeticIngredientId id;

    @MapsId("cosmeticId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cosmetic_id")
    private Cosmetic cosmetic;

    @MapsId("ingredientId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ingredient_id")
    private Ingredient ingredient;

    @Column(nullable = false)
    private int sequence;

    @Builder
    public CosmeticIngredient(Cosmetic cosmetic, Ingredient ingredient, int sequence) {
        this.cosmetic = cosmetic;
        this.ingredient = ingredient;
        this.sequence = sequence;
        // cosmetic와 ingredient가 이미 DB에 저장되어 있고, ID가 존재한다는 가정 하에 id를 생성합니다.
        this.id = new CosmeticIngredientId(cosmetic.getCosmeticId(), ingredient.getIngredientId());
    }
}
