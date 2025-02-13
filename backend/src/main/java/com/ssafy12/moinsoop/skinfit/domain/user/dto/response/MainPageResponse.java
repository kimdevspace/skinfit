package com.ssafy12.moinsoop.skinfit.domain.user.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PROTECTED)
public class MainPageResponse {
    private int level;
    private int goodCosmeticsCount;
    private int badCosmeticsCount;
    private List<RecommendedCosmeticInfo> recommendedCosmetics;

    @Getter
    @Builder
    @AllArgsConstructor(access = AccessLevel.PROTECTED)
    public static class RecommendedCosmeticInfo {
        private Integer cosmeticId;
        private String cosmeticName;
        private String brandName;
        private String imageUrl;
    }
}
