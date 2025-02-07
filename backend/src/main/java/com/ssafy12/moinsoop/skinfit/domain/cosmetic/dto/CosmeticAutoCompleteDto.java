package com.ssafy12.moinsoop.skinfit.domain.cosmetic.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CosmeticAutoCompleteDto {
    private Integer cosmeticId;
    private String cosmeticName;
    private String cosmeticBrand;
    private String categoryName;
}