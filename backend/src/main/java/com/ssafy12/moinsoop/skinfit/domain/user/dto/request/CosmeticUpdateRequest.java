package com.ssafy12.moinsoop.skinfit.domain.user.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class CosmeticUpdateRequest {
    private Integer cosmeticId;
    private String cosmeticBrand;
    private String cosmeticName;
    private Integer cosmeticVolume;
    private String imageUrl;
    private List<Integer> symptomIds;  // 안맞는 화장품일 경우에만 사용
}