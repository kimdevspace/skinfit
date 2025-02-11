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
public class IngredientExperienceDto {
    private Integer ingredientId;
    private String ingredientName;
    private List<SymptomDto> symptoms;  // 안맞는 성분일 경우에만 사용

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SymptomDto {
        private Integer symptomId;
        private String symptomName;
    }
}
