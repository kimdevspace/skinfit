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
                .map(CosmeticSummaryDto::new)
                .collect(Collectors.toList());
    }
}

/**
 * 화장품 검색 결과를 요약하여 제공하는 DTO
 */
@Getter
class CosmeticSummaryDto {
    private final Integer cosmeticId;
    private final String cosmeticName;
    private final String cosmeticBrand;
    private final String imageUrl;

    public CosmeticSummaryDto(Cosmetic cosmetic) {
        this.cosmeticId = cosmetic.getCosmeticId();
        this.cosmeticName = cosmetic.getCosmeticName();
        this.cosmeticBrand = cosmetic.getCosmeticBrand();
        this.imageUrl = cosmetic.getImageUrl();
    }
}
