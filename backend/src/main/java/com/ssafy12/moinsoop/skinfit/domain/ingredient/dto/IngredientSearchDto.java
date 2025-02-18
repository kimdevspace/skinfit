package com.ssafy12.moinsoop.skinfit.domain.ingredient.dto;

import com.ssafy12.moinsoop.skinfit.domain.cosmetic_ingredient.entity.CosmeticIngredient;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
public class IngredientSearchDto {
    private final List<IngredientDetailDto> low;
    private final List<IngredientDetailDto> moderate;
    private final List<IngredientDetailDto> high;
    private final List<IngredientDetailDto> others;

    public IngredientSearchDto(List<CosmeticIngredient> cosmeticIngredients) {
        this.low = filterByEwgScore(cosmeticIngredients, 1, 2);
        this.moderate = filterByEwgScore(cosmeticIngredients, 3, 6);
        this.high = filterByEwgScore(cosmeticIngredients, 7, 10);
        this.others = filterOthers(cosmeticIngredients);
    }

    private List<IngredientDetailDto> filterByEwgScore(List<CosmeticIngredient> cosmeticIngredients, Integer min, Integer max) {
        return cosmeticIngredients.stream()
                .map(ci -> new IngredientDetailDto(ci.getIngredient(), ci.getSequence()))
                .filter(dto -> dto.getEwgScoreMax() != null && dto.getEwgScoreMax() >= min && dto.getEwgScoreMax() <= max)
                .sorted((i1, i2) -> Integer.compare(i1.getSequence(), i2.getSequence())) // ✅ sequence 기준 정렬
                .collect(Collectors.toList());
    }

    private List<IngredientDetailDto> filterOthers(List<CosmeticIngredient> cosmeticIngredients) {
        return cosmeticIngredients.stream()
                .map(ci -> new IngredientDetailDto(ci.getIngredient(), ci.getSequence()))
                .filter(dto -> dto.getEwgScoreMax() == null || dto.getEwgScoreMax() == 0) // ✅ EWG 점수가 없는 경우만 포함
                .sorted((i1, i2) -> Integer.compare(i1.getSequence(), i2.getSequence()))
                .collect(Collectors.toList());
    }
}
