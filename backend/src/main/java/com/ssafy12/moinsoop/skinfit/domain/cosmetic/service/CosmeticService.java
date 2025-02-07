package com.ssafy12.moinsoop.skinfit.domain.cosmetic.service;

import com.ssafy12.moinsoop.skinfit.domain.cosmetic.dto.*;
import com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.Cosmetic;
import com.ssafy12.moinsoop.skinfit.domain.cosmetic.repository.CosmeticRepository;
import com.ssafy12.moinsoop.skinfit.domain.cosmetic_ingredient.entity.CosmeticIngredient;
import com.ssafy12.moinsoop.skinfit.domain.ingredient.entity.Ingredient;
import com.ssafy12.moinsoop.skinfit.domain.ingredient.repository.IngredientRepository;
import com.ssafy12.moinsoop.skinfit.global.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CosmeticService {

    private final CosmeticRepository cosmeticRepository;
    private final IngredientRepository ingredientRepository;

    // 전체 화장품 조회
    public CosmeticSearchDto getAllCosmetics(Integer userId) {
        List<CosmeticListDto> cosmetics = cosmeticRepository.findAll().stream()
                .map(CosmeticListDto::new)
                .collect(Collectors.toList());
        return new CosmeticSearchDto(cosmetics);
    }

    // 자동완성 검색
    public List<CosmeticAutoCompleteDto> autoCompleteCosmetic(String query, Integer userId) {
        return cosmeticRepository.findByCosmeticNameContainingIgnoreCase(query).stream()
                .map(cosmetic -> new CosmeticAutoCompleteDto(
                        cosmetic.getCosmeticId(),
                        cosmetic.getCosmeticName(),
                        cosmetic.getCosmeticBrand(),
                        cosmetic.getCategory().getCategoryName()))
                .collect(Collectors.toList());
    }

    // 성분 검색
    public List<String> searchIngredient(String query, Integer userId) {
        return ingredientRepository.findByIngredientNameContainingIgnoreCase(query).stream()
                .map(Ingredient::getIngredientName)
                .collect(Collectors.toList());
    }

    // 화장품 상세 검색 (필터링 포함)
    public CosmeticSearchDto searchCosmetics(String query, int page, int limit, Boolean filterByUserPreference, String category, Integer userId) {
        List<CosmeticListDto> cosmetics = cosmeticRepository.findByCosmeticNameContainingIgnoreCase(query).stream()
                .filter(cosmetic -> category == null || cosmetic.getCategory().getCategoryName().equals(category))
                .map(CosmeticListDto::new)
                .collect(Collectors.toList());
        return new CosmeticSearchDto(cosmetics);
    }

    // 특정 화장품 상세 조회
    public CosmeticDetailDto getCosmeticDetail(Integer cosmeticId, Integer userId) {
        Cosmetic cosmetic = cosmeticRepository.findById(cosmeticId)
                .orElseThrow(() -> new NotFoundException("해당 화장품을 찾을 수 없습니다: " + cosmeticId));

        List<Ingredient> ingredients = cosmetic.getCosmeticIngredients().stream()
                .map(CosmeticIngredient::getIngredient)
                .collect(Collectors.toList());

        return new CosmeticDetailDto(cosmetic, ingredients);
    }

    // 특정 화장품의 전체 성분 조회
    public List<CosmeticIngredientDto> getCosmeticIngredients(Integer cosmeticId, Integer userId) {
        Cosmetic cosmetic = cosmeticRepository.findById(cosmeticId)
                .orElseThrow(() -> new NotFoundException("해당 화장품을 찾을 수 없습니다: " + cosmeticId));

        return cosmetic.getCosmeticIngredients().stream()
                .map(ingredient -> new CosmeticIngredientDto(ingredient.getIngredient()))
                .collect(Collectors.toList());
    }
}
