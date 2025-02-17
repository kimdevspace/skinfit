package com.ssafy12.moinsoop.skinfit.domain.admin.dto;

import com.ssafy12.moinsoop.skinfit.domain.ingredient.dto.IngredientDetailDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CosmeticDetailResponse {
    private Integer cosmeticId;
    private String cosmeticName;
    private String cosmeticBrand;
    private String cosmeticVolume;
    private boolean status;
    private List<IngredientDetailDto> ingredients;
}
