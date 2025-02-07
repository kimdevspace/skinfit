package com.ssafy12.moinsoop.skinfit.domain.user.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class UnSuitIngredientDto {
    private String ingredientName;
    private Integer detectionCount;
}
