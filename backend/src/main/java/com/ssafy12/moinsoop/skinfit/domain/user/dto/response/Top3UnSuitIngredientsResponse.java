package com.ssafy12.moinsoop.skinfit.domain.user.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Top3UnSuitIngredientsResponse {
    private List<UnSuitIngredientDto> ingredients;
}
