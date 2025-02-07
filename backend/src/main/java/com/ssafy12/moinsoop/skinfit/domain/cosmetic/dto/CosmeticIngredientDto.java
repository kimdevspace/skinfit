package com.ssafy12.moinsoop.skinfit.domain.cosmetic.dto;

import com.ssafy12.moinsoop.skinfit.domain.ingredient.entity.Ingredient;
import lombok.Getter;

@Getter
public class CosmeticIngredientDto {
    private final String ingredientName;
    private final Integer ewgScoreMin;
    private final Integer ewgScoreMax;
    private final Integer foundCount; // 사용자가 사용한 제품에서 발견된 횟수

    public CosmeticIngredientDto(Ingredient ingredient) {
        this.ingredientName = ingredient.getIngredientName();
        this.ewgScoreMin = ingredient.getEwgScoreMin();
        this.ewgScoreMax = ingredient.getEwgScoreMax();
        this.foundCount = 0; // 기본값 설정
    }
}
