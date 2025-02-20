package com.ssafy12.moinsoop.skinfit.global.core.analysis;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.ssafy12.moinsoop.skinfit.domain.ingredient.entity.Ingredient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.io.Serializable;

@Getter
@Builder
@AllArgsConstructor
public class IngredientAnalysisResult implements Serializable {
    private Integer ingredientId;
    private int detectionCount;
}
