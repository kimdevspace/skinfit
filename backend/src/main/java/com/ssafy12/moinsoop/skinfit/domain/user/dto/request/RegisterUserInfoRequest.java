package com.ssafy12.moinsoop.skinfit.domain.user.dto.request;

import com.ssafy12.moinsoop.skinfit.domain.experience.entity.ProductExperience;
import com.ssafy12.moinsoop.skinfit.domain.user.entity.enums.Gender;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.aspectj.weaver.IUnwovenClassFile;

import java.time.Year;
import java.util.List;

@Getter
@NoArgsConstructor
public class RegisterUserInfoRequest {
    // 회원의 기본 정보 (성별, 태어난 연도, 닉네임)
    @NotNull
    private Gender gender;
    @NotNull
    private Year year;
    @NotNull
    @Size(min = 2, max = 50)
    private String nickname;

    // 피부 타입 정보
    @NotEmpty
    private List<Integer> skinTypeIds;

    // 화장품 경험 정보
    private List<SuitableProductRequest> suitableProducts; // 잘 맞는 화장품
    private List<UnsuitableProductRequest> unsuitableProducts; // 잘 맞지 않는 화장품

    // 성분 경험 정보
    private List<SuitableIngredientRequest> suitableIngredients; // 잘 맞는 성분
    private List<SuitableProductRequest> unsuitableIngredients; // 잘 맞지 앟는 성분

    // 잘 맞는 화장품 요청
    @Getter
    @NoArgsConstructor
    public static class SuitableProductRequest {
        @NotNull
        private Integer cosmeticId;
    }

    // 잘 맞지 않는 화장품 요청 (증상 필수)
    @Getter
    @NoArgsConstructor
    public static class UnsuitableProductRequest {
        @NotNull
        private Integer cosmeticId;

        @NotEmpty
        private List<Integer> symptomIds;  // 증상 ID 리스트 (필수)
    }

    // 잘 맞는 성분 요청
    @Getter
    @NoArgsConstructor
    public static class SuitableIngredientRequest {
        @NotNull
        private Integer ingredientId;
    }

    // 잘 맞지 않는 성분 요청 (증상 필수)
    @Getter
    @NoArgsConstructor
    public static class UnsuitableIngredientRequest {
        @NotNull
        private Integer ingredientId;

        @NotEmpty
        private List<Integer> symptomIds;  // 증상 ID 리스트 (필수)
    }
}
