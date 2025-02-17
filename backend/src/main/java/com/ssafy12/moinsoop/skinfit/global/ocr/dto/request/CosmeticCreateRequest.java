package com.ssafy12.moinsoop.skinfit.global.ocr.dto.request;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CosmeticCreateRequest {
    private String cosmeticName;
    private String cosmeticBrand;
    private Integer categoryId;
    private String cosmeticVolume;
//    private MultipartFile ingredientImage;
}
