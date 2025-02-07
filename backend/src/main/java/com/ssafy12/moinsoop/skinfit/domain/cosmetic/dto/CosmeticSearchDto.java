package com.ssafy12.moinsoop.skinfit.domain.cosmetic.dto;

import lombok.Getter;
import java.util.List;

@Getter
public class CosmeticSearchDto {
    private final int totalCount;
    private final List<CosmeticListDto> cosmetics;

    public CosmeticSearchDto(List<CosmeticListDto> cosmetics) {
        this.totalCount = cosmetics.size();
        this.cosmetics = cosmetics;
    }
}
