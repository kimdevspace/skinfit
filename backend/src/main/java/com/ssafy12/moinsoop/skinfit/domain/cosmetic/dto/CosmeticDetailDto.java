package com.ssafy12.moinsoop.skinfit.domain.cosmetic.dto;

import com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.Cosmetic;
import com.ssafy12.moinsoop.skinfit.domain.ingredient.entity.Ingredient;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
public class CosmeticDetailDto {
    private final Integer cosmeticId;
    private final String cosmeticName;
    private final String cosmeticBrand;
    private final String category;
    private final String imageUrl;
    private final List<CosmeticIngredientDto> ingredients;

    public CosmeticDetailDto(Cosmetic cosmetic, List<Ingredient> ingredientList) {
        this.cosmeticId = cosmetic.getCosmeticId();
        this.cosmeticName = cosmetic.getCosmeticName();
        this.cosmeticBrand = cosmetic.getCosmeticBrand();
        this.category = cosmetic.getCategory().getCategoryName();
        this.imageUrl = cosmetic.getImageUrl();
        this.ingredients = ingredientList.stream()
                .map(CosmeticIngredientDto::new)
                .collect(Collectors.toList());
    }
}
