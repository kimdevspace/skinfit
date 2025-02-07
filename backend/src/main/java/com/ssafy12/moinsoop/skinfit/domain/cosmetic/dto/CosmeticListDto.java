package com.ssafy12.moinsoop.skinfit.domain.cosmetic.dto;

import com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.Cosmetic;
import lombok.Getter;

@Getter
public class CosmeticListDto {
    private final Integer cosmeticId;
    private final String cosmeticName;
    private final String cosmeticBrand;
    private final String category;
    private final String imageUrl;

    public CosmeticListDto(Cosmetic cosmetic) {
        this.cosmeticId = cosmetic.getCosmeticId();
        this.cosmeticName = cosmetic.getCosmeticName();
        this.cosmeticBrand = cosmetic.getCosmeticBrand();
        this.category = cosmetic.getCategory().getCategoryName();
        this.imageUrl = cosmetic.getImageUrl();
    }
}
