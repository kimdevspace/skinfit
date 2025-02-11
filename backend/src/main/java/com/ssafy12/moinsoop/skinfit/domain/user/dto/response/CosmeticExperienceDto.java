package com.ssafy12.moinsoop.skinfit.domain.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CosmeticExperienceDto {
    private Integer cosmeticId;
    private String cosmeticBrand;
    private String cosmeticName;
    private Integer cosmeticVolume;
    private String imageUrl;
    private List<SymptomDto> symptoms;  // 안맞는 화장품일 경우에만 포함

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SymptomDto {
        private Integer symptomId;
        private String symptomName;
    }
}