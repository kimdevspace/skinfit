package com.ssafy12.moinsoop.skinfit.domain.cosmetic.dto;

import com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.Cosmetic;
import com.ssafy12.moinsoop.skinfit.domain.cosmetic_ingredient.entity.CosmeticIngredient;
import com.ssafy12.moinsoop.skinfit.domain.ingredient.dto.IngredientDetailDto;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
public class CosmeticDetailDto {
    private final String categoryName;
    private final String cosmeticName;
    private final String cosmeticBrand;
    private final Integer cosmeticVolume;
    private final String imageUrl;
    private final List<IngredientDetailDto> ingredients;

    // ✅ 안전/유의 여부 (레디스 연동 후 추가 예정)
    // private final String safetyStatus;

    public CosmeticDetailDto(Cosmetic cosmetic, List<CosmeticIngredient> cosmeticIngredients) {
        this.categoryName = cosmetic.getCategory().getCategoryName();
        this.cosmeticName = cosmetic.getCosmeticName();
        this.cosmeticBrand = cosmetic.getCosmeticBrand();
        this.cosmeticVolume = cosmetic.getCosmeticVolume();
        this.imageUrl = cosmetic.getImageUrl();

        // ✅ 성분 정렬 (sequence 기준 오름차순 정렬)
        this.ingredients = cosmeticIngredients.stream()
                .map(ci -> new IngredientDetailDto(ci.getIngredient(), ci.getSequence(), 0)) // foundCount 초기값 0 (추후 구현)
                .sorted((i1, i2) -> Integer.compare(i1.getSequence(), i2.getSequence()))
                .collect(Collectors.toList());

        // ✅ 안전/유의 여부 (레디스 연동 후 추가 예정)
        // this.safetyStatus = someLogicToDetermineSafety();
    }
}
