package com.ssafy12.moinsoop.skinfit.domain.cosmetic.service;

import com.ssafy12.moinsoop.skinfit.domain.cosmetic.dto.CosmeticSearchDto;
import com.ssafy12.moinsoop.skinfit.domain.cosmetic.dto.CosmeticAutoCompleteDto;
import com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.Cosmetic;
import com.ssafy12.moinsoop.skinfit.domain.cosmetic.repository.CosmeticRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CosmeticService {
    private final CosmeticRepository cosmeticRepository;

    // 🔍 화장품 자동완성 검색 (10개 제한, 브랜드 + 화장품명 검색 가능)
    public List<CosmeticAutoCompleteDto> autoCompleteCosmetic(String query) {
        List<Cosmetic> cosmetics = cosmeticRepository.findTop10ByCosmeticNameOrBrandContainingIgnoreCase(query, PageRequest.of(0, 10));

        return cosmetics.stream()
                .map(c -> new CosmeticAutoCompleteDto(c.getCosmeticName(), c.getCosmeticBrand()))
                .collect(Collectors.toList());
    }

    // 🔍 화장품 돋보기 검색 (카테고리 필터 포함)
    public CosmeticSearchDto searchCosmetics(String query, String category) {
        List<Cosmetic> cosmetics = cosmeticRepository.searchCosmetics(query, category, PageRequest.of(0, 10));
        return new CosmeticSearchDto(cosmetics);
    }
}