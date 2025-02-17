package com.ssafy12.moinsoop.skinfit.domain.admin.controller;

import com.ssafy12.moinsoop.skinfit.domain.admin.dto.CosmeticDetailResponse;
import com.ssafy12.moinsoop.skinfit.domain.admin.dto.UnverifiedCosmeticResponse;
import com.ssafy12.moinsoop.skinfit.domain.admin.dto.UpdateCosmeticRequest;
import com.ssafy12.moinsoop.skinfit.domain.admin.service.AdminCosmeticService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/cosmetics")
@RequiredArgsConstructor
public class AdminCosmeticController {

    private final AdminCosmeticService adminCosmeticService;

    /**
     * 미검수 화장품 목록 조회
     * GET /api/v1/admin/cosmetics/unverified
     */
    @GetMapping("/unverified")
    public ResponseEntity<List<UnverifiedCosmeticResponse>> getUnverifiedCosmetics() {
        List<UnverifiedCosmeticResponse> result = adminCosmeticService.getUnverifiedCosmetics();
        return ResponseEntity.ok(result);
    }

    /**
     * 화장품 상세 조회
     * GET /api/v1/admin/cosmetics/{cosmeticId}
     */
    @GetMapping("/{cosmeticId}")
    public ResponseEntity<CosmeticDetailResponse> getCosmeticDetail(@PathVariable Integer cosmeticId) {
        CosmeticDetailResponse detail = adminCosmeticService.getCosmeticDetail(cosmeticId);
        return ResponseEntity.ok(detail);
    }

    /**
     * 화장품 정보 수정 (검수 등록)
     * PUT /api/v1/admin/cosmetics/{cosmeticId}
     */
    @PutMapping("/{cosmeticId}")
    public ResponseEntity<String> updateCosmetic(@PathVariable Integer cosmeticId,
                                                 @RequestBody @Valid UpdateCosmeticRequest request) {
        adminCosmeticService.updateCosmetic(cosmeticId, request);
        return ResponseEntity.ok("화장품 정보가 수정 및 검수 완료되었습니다.");
    }
}
