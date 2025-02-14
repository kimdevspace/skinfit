package com.ssafy12.moinsoop.skinfit.domain.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MyCosmeticsResponse {
    private List<CosmeticExperienceDto> suitableCosmetics;
    private List<CosmeticExperienceDto> unsuitableCosmetics;

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CosmeticExperienceDto {
        private Integer cosmeticId;
        private String cosmeticBrand;
        private String cosmeticName;
        private String cosmeticVolume;
        private String imageUrl;

    }

}
