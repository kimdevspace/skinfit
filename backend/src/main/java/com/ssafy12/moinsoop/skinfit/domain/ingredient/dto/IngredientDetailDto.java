// 화장품 상세보기에서 가져가는 데이터

package com.ssafy12.moinsoop.skinfit.domain.ingredient.dto;

import com.ssafy12.moinsoop.skinfit.domain.ingredient.entity.Ingredient;
import lombok.Getter;

@Getter
public class IngredientDetailDto {
    private final String ingredientName;
    private final Integer ewgScoreMin;
    private final Integer ewgScoreMax;
    private final Integer foundCount;
    private final Integer sequence;

    public IngredientDetailDto(Ingredient ingredient, int sequence, int foundCount) {
        this.ingredientName = ingredient.getIngredientName();
        this.ewgScoreMin = ingredient.getEwgScoreMin();
        this.ewgScoreMax = ingredient.getEwgScoreMax();
        this.sequence = sequence;

        // ✅ foundCount는 현재 구현 불가 → 주석 처리
        // this.foundCount = foundCount;
        this.foundCount = 0; // 현재는 구현할 수 없으므로 기본값 0으로 설정
    }
}
