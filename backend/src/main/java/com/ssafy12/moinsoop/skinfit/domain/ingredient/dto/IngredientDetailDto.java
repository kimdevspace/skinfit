package com.ssafy12.moinsoop.skinfit.domain.ingredient.dto;

import com.ssafy12.moinsoop.skinfit.domain.ingredient.entity.Ingredient;
import lombok.Getter;

@Getter
public class IngredientDetailDto {
    private final Integer ingredientId;
    private final String ingredientName;
    private final Integer ewgScoreMin;
    private final Integer ewgScoreMax;
    private final Integer sequence;
    private final boolean status;

    public IngredientDetailDto(Ingredient ingredient, int sequence) {
        this.ingredientId = ingredient.getIngredientId();
        this.ingredientName = ingredient.getIngredientName();
        this.ewgScoreMin = ingredient.getEwgScoreMin();
        this.ewgScoreMax = ingredient.getEwgScoreMax();
        this.sequence = sequence;
        this.status = ingredient.isStatus();
    }
}