package com.ssafy12.moinsoop.skinfit.domain.cosmetic.service;

import com.ssafy12.moinsoop.skinfit.domain.cosmetic.dto.CosmeticSearchDto;
import com.ssafy12.moinsoop.skinfit.domain.cosmetic.dto.CosmeticAutoCompleteDto;
import com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.Cosmetic;
import com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.repository.CosmeticRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
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
}