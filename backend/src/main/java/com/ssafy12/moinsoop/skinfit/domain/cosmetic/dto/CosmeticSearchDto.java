package com.ssafy12.moinsoop.skinfit.domain.cosmetic.dto;

import com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.Cosmetic;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
public class CosmeticSearchDto {
    private final List<CosmeticSummaryDto> cosmetics;

    public CosmeticSearchDto(List<Cosmetic> cosmetics) {
        this.cosmetics = cosmetics.stream()
                .limit(10) // 최대 10개만 반환
                .map(cosmetic -> new CosmeticSummaryDto(cosmetic, true))
                .collect(Collectors.toList());
    }

    @Getter
    public static class CosmeticSummaryDto {
        private final Integer cosmeticId;
        private final String cosmeticName;
        private final String cosmeticBrand;
        private final String imageUrl;
        private final boolean safetyStatus;

        public CosmeticSummaryDto(Cosmetic cosmetic, boolean safetyStatus) {
            this.cosmeticId = cosmetic.getCosmeticId();
            this.cosmeticName = cosmetic.getCosmeticName();
            this.cosmeticBrand = cosmetic.getCosmeticBrand();
            this.imageUrl = cosmetic.getImageUrl();
            this.safetyStatus = safetyStatus;
        }
    }
}