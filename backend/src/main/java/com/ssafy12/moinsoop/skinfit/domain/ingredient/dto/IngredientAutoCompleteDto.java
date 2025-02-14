package com.ssafy12.moinsoop.skinfit.domain.ingredient.dto;

import lombok.Getter;

@Getter
public class IngredientAutoCompleteDto {
    private final Integer ingredientId;
    private final String ingredientName;

    public IngredientAutoCompleteDto(Integer ingredientId, String ingredientName) {
        this.ingredientId = ingredientId;
        this.ingredientName = ingredientName;
    }
}