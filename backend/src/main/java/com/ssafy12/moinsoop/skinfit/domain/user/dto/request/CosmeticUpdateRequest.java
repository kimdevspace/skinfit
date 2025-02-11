package com.ssafy12.moinsoop.skinfit.domain.user.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CosmeticUpdateRequest {
    private Integer cosmeticId;
    private String cosmeticBrand;
    private String cosmeticName;
    private Integer cosmeticVolume;
    private String imageUrl;
}
