package com.ssafy12.moinsoop.skinfit.global.ocr.controller;

import com.ssafy12.moinsoop.skinfit.domain.cosmetic.service.CosmeticService;
import com.ssafy12.moinsoop.skinfit.global.ocr.dto.request.CosmeticCreateRequest;
import com.ssafy12.moinsoop.skinfit.global.ocr.service.OCRService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/")
@RequiredArgsConstructor
public class OCRController {

    private final OCRService ocrService;

    // 사용자의 OCR 등록
    @PostMapping(value = "/ocr", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> createCosmetic(@RequestPart("data") CosmeticCreateRequest request,
                                               @RequestPart("ingredientImage") MultipartFile ingredientImage) {
        ocrService.createCosmetic(request, ingredientImage);
        return ResponseEntity.ok().build();
    }
}
