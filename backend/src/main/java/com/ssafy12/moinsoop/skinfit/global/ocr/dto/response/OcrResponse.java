package com.ssafy12.moinsoop.skinfit.global.ocr.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class OcrResponse {
    private List<IngredientData> ingredients;

    @Getter
    @NoArgsConstructor
    public static class IngredientData {
        private String name;
    }

}
