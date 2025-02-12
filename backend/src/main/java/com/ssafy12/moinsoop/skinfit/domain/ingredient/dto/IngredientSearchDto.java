// 전성분 조회를 위한 DTO
// 전성분 조회를 위한 DTO
package com.ssafy12.moinsoop.skinfit.domain.ingredient.dto;

import com.ssafy12.moinsoop.skinfit.domain.ingredient.entity.Ingredient;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
public class IngredientSearchDto {
    private final List<IngredientDetailDto> low;
    private final List<IngredientDetailDto> moderate;
    private final List<IngredientDetailDto> high;
    private final List<IngredientDetailDto> others;

    public IngredientSearchDto(List<Ingredient> ingredients) {
        this.low = ingredients.stream()
                .filter(i -> i.getEwgScoreMax() != null && i.getEwgScoreMax() >= 1 && i.getEwgScoreMax() <= 2)
                .map(i -> new IngredientDetailDto(i, 0, 0)) // sequence, foundCount는 불필요 → 기본값 0
                .collect(Collectors.toList());

        this.moderate = ingredients.stream()
                .filter(i -> i.getEwgScoreMax() != null && i.getEwgScoreMax() >= 3 && i.getEwgScoreMax() <= 6)
                .map(i -> new IngredientDetailDto(i, 0, 0))
                .collect(Collectors.toList());

        this.high = ingredients.stream()
                .filter(i -> i.getEwgScoreMax() != null && i.getEwgScoreMax() >= 7 && i.getEwgScoreMax() <= 10)
                .map(i -> new IngredientDetailDto(i, 0, 0))
                .collect(Collectors.toList());

        this.others = ingredients.stream()
                .filter(i -> i.getEwgScoreMax() == null)
                .map(i -> new IngredientDetailDto(i, 0, 0))
                .collect(Collectors.toList());
    }
}