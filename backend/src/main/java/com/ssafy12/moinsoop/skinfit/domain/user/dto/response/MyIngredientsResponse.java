package com.ssafy12.moinsoop.skinfit.domain.user.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MyIngredientsResponse {
    private List<IngredientExperienceDto> suitableIngredients;
    private List<IngredientExperienceDto> unsuitableIngredients;

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class IngredientExperienceDto {
        private Integer ingredientId;
        private String ingredientName;
        private Integer ewgScoreMin;
        private Integer ewgScoreMax;
    }
}
