package com.ssafy12.moinsoop.skinfit.domain.cosmetic.dto;

import lombok.Getter;

@Getter
public class CosmeticAutoCompleteDto {
    private final String cosmeticWithBrand;

    public CosmeticAutoCompleteDto(String cosmeticName, String cosmeticBrand) {
        this.cosmeticWithBrand = cosmeticBrand + " " + cosmeticName;
    }
}
