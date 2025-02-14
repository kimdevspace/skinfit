package com.ssafy12.moinsoop.skinfit.domain.user.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PROTECTED)
public class Top3BadIngredientsResponse {
    private List<String> ingredientNames;
}
