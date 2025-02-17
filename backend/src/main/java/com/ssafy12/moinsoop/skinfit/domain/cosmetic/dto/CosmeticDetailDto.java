package com.ssafy12.moinsoop.skinfit.domain.cosmetic.dto;

import com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.Cosmetic;
import com.ssafy12.moinsoop.skinfit.domain.ingredient.entity.Ingredient;
import lombok.Getter;

import java.util.List;

@Getter
public class CosmeticDetailDto {
    private final Integer cosmeticId;
    private final String cosmeticName;
    private final String cosmeticBrand;
    private final String imageUrl;
    private final boolean isSafe;  // 안전/유의 상품 여부
    private final List<IngredientAnalysisDto> ingredients;

    public CosmeticDetailDto(Cosmetic cosmetic, boolean isSafe, List<IngredientAnalysisDto> ingredients) {
        this.cosmeticId = cosmetic.getCosmeticId();
        this.cosmeticName = cosmetic.getCosmeticName();
        this.cosmeticBrand = cosmetic.getCosmeticBrand();
        this.imageUrl = cosmetic.getImageUrl();
        this.isSafe = isSafe;
        this.ingredients = ingredients;
    }

    @Getter
    public static class IngredientAnalysisDto {
        private final Integer ingredientId;
        private final String ingredientName;
        private final int detectionCount;  // 검출 횟수
        private final Integer ewgScoreMin;     // EWG 최소 점수
        private final Integer ewgScoreMax;     // EWG 최대 점수

        public IngredientAnalysisDto(Ingredient ingredient, int detectionCount) {
            this.ingredientId = ingredient.getIngredientId();
            this.ingredientName = ingredient.getIngredientName();
            this.detectionCount = detectionCount;
            this.ewgScoreMin = ingredient.getEwgScoreMin();
            this.ewgScoreMax = ingredient.getEwgScoreMax();
        }
    }
}
