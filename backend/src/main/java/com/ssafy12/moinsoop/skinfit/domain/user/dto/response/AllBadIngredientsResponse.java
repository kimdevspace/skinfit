package com.ssafy12.moinsoop.skinfit.domain.user.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PROTECTED)
public class AllBadIngredientsResponse {
    private List<BadIngredientInfo> ingredients;

    @Getter
    @Builder
    @AllArgsConstructor(access = AccessLevel.PROTECTED)
    public static class BadIngredientInfo {
        private String ingredientName;
        private Integer ewgScoreMin;
        private Integer ewgScoreMax;
        private int detectionCount;
    }
}
