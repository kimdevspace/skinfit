package com.ssafy12.moinsoop.skinfit.domain.cosmetic.service;

import com.ssafy12.moinsoop.skinfit.domain.cosmetic.dto.CosmeticDetailDto;
import com.ssafy12.moinsoop.skinfit.domain.cosmetic.dto.CosmeticSearchDto;
import com.ssafy12.moinsoop.skinfit.domain.cosmetic.dto.CosmeticAutoCompleteDto;
import com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.Cosmetic;
import com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.repository.CosmeticRepository;
import com.ssafy12.moinsoop.skinfit.domain.ingredient.entity.Ingredient;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CosmeticService {
    private final CosmeticRepository cosmeticRepository;
    private final RedisTemplate redisTemplate;

    // 🔍 화장품 자동완성 검색 (10개 제한, 브랜드 + 화장품명 검색 가능)
    public List<CosmeticAutoCompleteDto> autoCompleteCosmetic(String query) {
        List<Cosmetic> cosmetics = cosmeticRepository.findTop10ByCosmeticNameOrBrandContainingIgnoreCase(query, PageRequest.of(0, 10));

        return cosmetics.stream()
                .map(c -> new CosmeticAutoCompleteDto(c.getCosmeticName(), c.getCosmeticBrand()))
                .collect(Collectors.toList());
    }

    // 🔍 화장품 돋보기 검색 (카테고리 필터 포함)
    public CosmeticSearchDto searchCosmetics(String query, String category, Integer userId) {
        // 1. 화장품 검색
        List<Cosmetic> cosmetics = cosmeticRepository.searchCosmetics(query, category, PageRequest.of(0, 10));

        // 2. 레디스에서 사용자의 안맞는 성분 Map 가져오기
        Map<String, Integer> unsafeIngredientsMap = (Map<String, Integer>) redisTemplate
                .opsForValue()
                .get("ingredient:analysis:" + userId);

        if (unsafeIngredientsMap == null || unsafeIngredientsMap.isEmpty()) {
            return new CosmeticSearchDto(cosmetics);  // 안맞는 성분이 없으면 모두 safe
        }

        // 3. Map의 키들을 Long 타입의 Set으로 변환
        Set<Integer> unsafeIngredientIds = unsafeIngredientsMap.keySet()
                .stream()
                .map(Integer::parseInt)
                .collect(Collectors.toSet());

        // 4. 각 화장품의 안전성을 체크하여 DTO 리스트 생성
        List<CosmeticSearchDto.CosmeticSummaryDto> checkedCosmetics = cosmetics.stream()
                .limit(10)
                .map(cosmetic -> {
                    Set<Integer> cosmeticIngredientIds = cosmetic.getCosmeticIngredients().stream()
                            .map(ci -> ci.getIngredient().getIngredientId())
                            .collect(Collectors.toSet());

                    boolean isSafe = Collections.disjoint(cosmeticIngredientIds, unsafeIngredientIds);
                    return new CosmeticSearchDto.CosmeticSummaryDto(cosmetic, isSafe);
                })
                .collect(Collectors.toList());

        // 5. CosmeticSearchDto 생성
        return new CosmeticSearchDto(cosmetics) {
            @Override
            public List<CosmeticSummaryDto> getCosmetics() {
                return checkedCosmetics;
            }
        };
    }

    // 화장품 상세보기
    public CosmeticDetailDto getCosmeticDetail(Integer cosmeticId, Integer userId) {
        // 1. 화장품 정보 조회
        Cosmetic cosmetic = cosmeticRepository.findById(cosmeticId)
                .orElseThrow(() -> new EntityNotFoundException("화장품을 찾을 수 없습니다"));

        // 2. 레디스에서 사용자의 성분 분석 데이터 조회
        final Map<String, Integer> ingredientAnalysisMap = Optional.ofNullable(
                (Map<String, Integer>) redisTemplate.opsForValue().get("ingredient:analysis:" + userId)
        ).orElse(new HashMap<>());

// 3. 화장품의 각 성분별 검출 횟수 확인 및 DTO 생성
        List<CosmeticDetailDto.IngredientAnalysisDto> ingredientAnalyses = cosmetic.getCosmeticIngredients().stream()
                .map(ci -> {
                    Ingredient ingredient = ci.getIngredient();
                    int detectionCount = ingredientAnalysisMap
                            .getOrDefault(String.valueOf(ingredient.getIngredientId()), 0);
                    return new CosmeticDetailDto.IngredientAnalysisDto(ingredient, detectionCount);
                })
                .collect(Collectors.toList());

        // 4. 안전 여부 판단 (하나라도 검출된 성분이 있으면 유의 상품)
        boolean isSafe = ingredientAnalyses.stream()
                .noneMatch(analysis -> analysis.getDetectionCount() > 0);

        return new CosmeticDetailDto(cosmetic, isSafe, ingredientAnalyses);
    }
}