package com.ssafy12.moinsoop.skinfit.domain.user.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class IngredientUpdateRequest {
    private Integer ingredientId;
    private List<Integer> symptomIds;
}
