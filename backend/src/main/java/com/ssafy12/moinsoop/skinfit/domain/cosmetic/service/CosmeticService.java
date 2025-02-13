package com.ssafy12.moinsoop.skinfit.domain.cosmetic.service;

import com.ssafy12.moinsoop.skinfit.domain.cosmetic.dto.CosmeticAutoCompleteDto;
import com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.Cosmetic;
import com.ssafy12.moinsoop.skinfit.domain.cosmetic.repository.CosmeticRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CosmeticService {
    private final CosmeticRepository cosmeticRepository;

    // 🔍 화장품 자동완성 검색 (최대 10개)
    public List<CosmeticAutoCompleteDto> autoCompleteCosmetic(String query) {
        PageRequest limit = PageRequest.of(0, 10);  // ✅ 1페이지, 10개 제한
        Page<Cosmetic> cosmetics = cosmeticRepository.findByCosmeticNameContainingIgnoreCase(query, limit);

        return cosmetics.stream()
                .map(c -> new CosmeticAutoCompleteDto(c.getCosmeticName(), c.getCosmeticBrand()))
                .collect(Collectors.toList());
    }
}
