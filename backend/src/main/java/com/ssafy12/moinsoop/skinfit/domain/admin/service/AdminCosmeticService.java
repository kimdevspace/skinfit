package com.ssafy12.moinsoop.skinfit.domain.admin.service;

import com.ssafy12.moinsoop.skinfit.domain.admin.dto.CosmeticDetailResponse;
import com.ssafy12.moinsoop.skinfit.domain.ingredient.dto.IngredientDetailDto;
import com.ssafy12.moinsoop.skinfit.domain.admin.dto.UnverifiedCosmeticResponse;
import com.ssafy12.moinsoop.skinfit.domain.admin.dto.UpdateCosmeticRequest;
import com.ssafy12.moinsoop.skinfit.domain.admin.exception.AdminException;
import com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.Cosmetic;
import com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.repository.CosmeticRepository;
import com.ssafy12.moinsoop.skinfit.domain.cosmetic_ingredient.entity.CosmeticIngredient;
import com.ssafy12.moinsoop.skinfit.domain.cosmetic_ingredient.entity.repository.CosmeticIngredientRepository;
import com.ssafy12.moinsoop.skinfit.domain.ingredient.entity.Ingredient;
import com.ssafy12.moinsoop.skinfit.domain.ingredient.entity.repository.IngredientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminCosmeticService {

    private final CosmeticRepository cosmeticRepository;
    private final CosmeticIngredientRepository cosmeticIngredientRepository;
    private final IngredientRepository ingredientRepository;

    /**
     * 미검수(0) 상태인 화장품 리스트 조회
     */
    @Transactional(readOnly = true)
    public List<UnverifiedCosmeticResponse> getUnverifiedCosmetics() {
        List<Cosmetic> cosmetics = cosmeticRepository.findByStatusFalse(); // status = false (미검수)
        return cosmetics.stream()
                .map(c -> new UnverifiedCosmeticResponse(c.getCosmeticId(), c.getCosmeticName()))
                .collect(Collectors.toList());
    }

    /**
     * 화장품 상세 조회 (성분 정보 포함)
     */
    @Transactional(readOnly = true)
    public CosmeticDetailResponse getCosmeticDetail(Integer cosmeticId) {
        Cosmetic cosmetic = cosmeticRepository.findById(cosmeticId)
                .orElseThrow(() -> new AdminException("해당 화장품이 존재하지 않습니다."));

        // cosmeticIngredient 엔티티에서 IngredientDetailDto로 매핑 (sequence 값 포함)
        List<IngredientDetailDto> ingredients = cosmetic.getCosmeticIngredients().stream()
                .sorted(Comparator.comparingInt(CosmeticIngredient::getSequence))
                .map(ci -> new IngredientDetailDto(ci.getIngredient(), ci.getSequence()))
                .collect(Collectors.toList());

        return new CosmeticDetailResponse(
                cosmetic.getCosmeticId(),
                cosmetic.getCosmeticName(),
                cosmetic.getCosmeticBrand(),
                cosmetic.getCosmeticVolume(),
                cosmetic.isStatus(),
                ingredients  // CosmeticDetailResponse의 ingredients 필드를 List<IngredientDetailDto>로 변경
        );
    }


    /**
     * 화장품 정보 수정 (검수 등록) - 화장품 정보와 성분 업데이트
     */
    @Transactional
    public void updateCosmetic(Integer cosmeticId, UpdateCosmeticRequest request) {
        Cosmetic cosmetic = cosmeticRepository.findById(cosmeticId)
                .orElseThrow(() -> new AdminException("해당 화장품이 존재하지 않습니다."));

        // 화장품 기본 정보 수정
        cosmetic.setCosmeticName(request.getCosmeticName());
        cosmetic.setCosmeticBrand(request.getCosmeticBrand());
        cosmetic.setCosmeticVolume(request.getCosmeticVolume());

        // 검수 완료 처리 (status true)
        cosmetic.setStatus(true);

        // 기존 성분 연관관계 삭제
        cosmeticIngredientRepository.deleteByCosmetic(cosmetic);

        // 요청으로 받은 성분 ID 목록으로 새로운 연관관계 생성
        if (request.getIngredientIds() != null) {
            for (int i = 0; i < request.getIngredientIds().size(); i++) {
                Integer ingredientId = request.getIngredientIds().get(i);
                Ingredient ingredient = ingredientRepository.findById(ingredientId)
                        .orElseThrow(() -> new AdminException("해당 성분이 존재하지 않습니다."));
                CosmeticIngredient cosmeticIngredient = CosmeticIngredient.builder()
                        .cosmetic(cosmetic)
                        .ingredient(ingredient)
                        .sequence(i + 1)
                        .build();
                cosmeticIngredientRepository.save(cosmeticIngredient);
            }
        }
    }
}
