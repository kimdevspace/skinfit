package com.ssafy12.moinsoop.skinfit.domain.cosmetic.controller;

import com.ssafy12.moinsoop.skinfit.domain.cosmetic.dto.CosmeticAutoCompleteDto;
import com.ssafy12.moinsoop.skinfit.domain.cosmetic.dto.CosmeticSearchDto;
import com.ssafy12.moinsoop.skinfit.domain.cosmetic.service.CosmeticService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cosmetic")
@RequiredArgsConstructor
public class CosmeticController {
    private final CosmeticService cosmeticService;

    // 🔍 화장품 자동완성 검색 API
    @GetMapping("/autocomplete")
    public List<CosmeticAutoCompleteDto> autoCompleteCosmetic(@RequestParam String query) {
        return cosmeticService.autoCompleteCosmetic(query);
    }

    // 🔍 화장품 돋보기 검색 API
    @GetMapping("/search")
    public ResponseEntity<CosmeticSearchDto> searchCosmetics(
            @AuthenticationPrincipal Integer userId,
            @RequestParam String query,
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(cosmeticService.searchCosmetics(query, category, userId));
    }

}