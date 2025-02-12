package com.ssafy12.moinsoop.skinfit.global.core.analysis;

import com.ssafy12.moinsoop.skinfit.domain.experience.entity.CosmeticExperience;
import com.ssafy12.moinsoop.skinfit.domain.experience.entity.repository.CosmeticExperienceRepository;
import com.ssafy12.moinsoop.skinfit.domain.experience.entity.repository.IngredientExperienceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IngredientAnalysisService {

    private final CosmeticExperienceRepository cosmeticExperienceRepository;
    private final IngredientExperienceRepository ingredientExperienceRepository;

    public Map<Integer, Integer> analyzeIngredientsForUser(Integer userId) {
        // 1. 잘 맞는 화장품의 성분 ID 수집
        Set<Integer> suitableIngredientIds = collectSuitableIngredientIds(userId);

        // 2. 안 맞는 화장품의 성분 ID 수집 (잘 맞는 성분 제외)
        Set<Integer> unsuitableIngredientIds = collectUnsuitableIngredientIds(userId);
        unsuitableIngredientIds.removeAll(suitableIngredientIds);

        // 3. 직접 등록한 안 맞는 성분 ID 추가
        Set<Integer> directlyRegisteredUnsuitableIngredientIds = collectDirectlyRegisteredUnsuitableIngredientIds(userId);
        unsuitableIngredientIds.addAll(directlyRegisteredUnsuitableIngredientIds);

        // 4. 검출 횟수 계산 및 Map으로 반환
        return calculateDetectionCounts(userId, unsuitableIngredientIds);
    }

    private Set<Integer> collectSuitableIngredientIds(Integer userId) {
        return cosmeticExperienceRepository.findByUser_UserIdAndIsSuitableTrue(userId).stream()
                .map(CosmeticExperience::getCosmetic)
                .flatMap(cosmetic -> cosmetic.getCosmeticIngredients().stream())
                .map(ci -> ci.getIngredient().getIngredientId())
                .collect(Collectors.toSet());
    }

    private Set<Integer> collectUnsuitableIngredientIds(Integer userId) {
        return cosmeticExperienceRepository.findByUser_UserIdAndIsSuitableFalse(userId).stream()
                .map(CosmeticExperience::getCosmetic)
                .flatMap(cosmetic -> cosmetic.getCosmeticIngredients().stream())
                .map(ci -> ci.getIngredient().getIngredientId())
                .collect(Collectors.toSet());
    }

    private Set<Integer> collectDirectlyRegisteredUnsuitableIngredientIds(Integer userId) {
        return ingredientExperienceRepository.findByUser_UserIdAndIsSuitableFalse(userId).stream()
                .map(ie -> ie.getIngredient().getIngredientId())
                .collect(Collectors.toSet());
    }

    private Map<Integer, Integer> calculateDetectionCounts(Integer userId, Set<Integer> unsuitableIngredientIds) {
        Map<Integer, Integer> detectionCounts = new HashMap<>();

        cosmeticExperienceRepository.findByUser_UserIdAndIsSuitableFalse(userId)
                .stream()
                .map(CosmeticExperience::getCosmetic)
                .flatMap(cosmetic -> cosmetic.getCosmeticIngredients().stream())
                .map(ci -> ci.getIngredient().getIngredientId())
                .filter(unsuitableIngredientIds::contains)
                .forEach(ingredientId ->
                        detectionCounts.merge(ingredientId, 1, Integer::sum)
                );

        return detectionCounts;
    }
}