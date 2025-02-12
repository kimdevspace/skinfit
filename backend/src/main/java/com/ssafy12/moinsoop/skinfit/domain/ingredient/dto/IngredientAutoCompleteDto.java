// 성분 자동완성

package com.ssafy12.moinsoop.skinfit.domain.ingredient.dto;

import com.ssafy12.moinsoop.skinfit.domain.ingredient.entity.Ingredient;
import lombok.Getter;

@Getter
public class IngredientAutoCompleteDto {
    private final Integer ingredientId;
    private final String ingredientName;

    public IngredientAutoCompleteDto(Ingredient ingredient) {
        this.ingredientId = ingredient.getIngredientId();
        this.ingredientName = ingredient.getIngredientName();
    }
}
