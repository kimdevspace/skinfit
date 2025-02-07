package com.ssafy12.moinsoop.skinfit.domain.cosmetic.controller;

import com.ssafy12.moinsoop.skinfit.domain.cosmetic.dto.*;
import com.ssafy12.moinsoop.skinfit.domain.cosmetic.service.CosmeticService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class CosmeticController {

    private final CosmeticService cosmeticService;

    // 전체 화장품 가져오기 -> `/api/v1/all-cosmetics`
    @GetMapping("/all-cosmetics")
    public ResponseEntity<CosmeticSearchDto> getAllCosmetics(@AuthenticationPrincipal Integer userId) {
        return ResponseEntity.ok(cosmeticService.getAllCosmetics(userId));
    }

    // 자동완성 검색 -> `/api/v1/search/cosmetic?query=검색어`
    @GetMapping("/search/cosmetic")
    public ResponseEntity<List<CosmeticAutoCompleteDto>> autoCompleteCosmetic(
            @RequestParam String query,
            @AuthenticationPrincipal Integer userId) {
        return ResponseEntity.ok(cosmeticService.autoCompleteCosmetic(query, userId));
    }

    // 성분명 검색 -> `/api/v1/search/ingredient?query=검색어`
    @GetMapping("/search/ingredient")
    public ResponseEntity<List<String>> searchIngredient(
            @RequestParam String query,
            @AuthenticationPrincipal Integer userId) {
        return ResponseEntity.ok(cosmeticService.searchIngredient(query, userId));
    }

    // 화장품 상세 검색 -> `/api/v1/search/cosmetic?query=검색어&page=1&limit=10&filterByUserPreference=true&Category=스킨케어`
    @GetMapping("/search/cosmetic/details")
    public ResponseEntity<CosmeticSearchDto> searchCosmetics(
            @RequestParam String query,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) Boolean filterByUserPreference,
            @RequestParam(required = false) String category,
            @AuthenticationPrincipal Integer userId) {
        return ResponseEntity.ok(cosmeticService.searchCosmetics(query, page, limit, filterByUserPreference, category, userId));
    }

    // 특정 화장품 상세 조회 -> `/api/v1/cosmetic/{cosmeticId}`
    @GetMapping("/cosmetic/{cosmeticId}")
    public ResponseEntity<CosmeticDetailDto> getCosmeticDetail(
            @PathVariable Integer cosmeticId,
            @AuthenticationPrincipal Integer userId) {
        return ResponseEntity.ok(cosmeticService.getCosmeticDetail(cosmeticId, userId));
    }

    // 특정 화장품의 전체 성분 조회 -> `/api/v1/cosmetic/{cosmeticId}/all-ingredients`
    @GetMapping("/cosmetic/{cosmeticId}/all-ingredients")
    public ResponseEntity<List<CosmeticIngredientDto>> getCosmeticIngredients(
            @PathVariable Integer cosmeticId,
            @AuthenticationPrincipal Integer userId) {
        return ResponseEntity.ok(cosmeticService.getCosmeticIngredients(cosmeticId, userId));
    }
}