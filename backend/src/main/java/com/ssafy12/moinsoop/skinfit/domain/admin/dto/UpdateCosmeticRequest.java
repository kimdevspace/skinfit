package com.ssafy12.moinsoop.skinfit.domain.admin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.List;

@Getter
@NoArgsConstructor
public class UpdateCosmeticRequest {
    @NotBlank
    private String cosmeticName;
    @NotBlank
    private String cosmeticBrand;
    @NotBlank
    private String cosmeticVolume;

    private List<String> ingredientIds;
}
