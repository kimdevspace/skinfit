package com.ssafy12.moinsoop.skinfit.global.ocr.service;

import com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.Category;
import com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.Cosmetic;
import com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.repository.CategoryRepository;
import com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.repository.CosmeticRepository;
import com.ssafy12.moinsoop.skinfit.domain.cosmetic_ingredient.entity.CosmeticIngredient;
import com.ssafy12.moinsoop.skinfit.domain.cosmetic_ingredient.entity.CosmeticIngredientId;
import com.ssafy12.moinsoop.skinfit.domain.cosmetic_ingredient.entity.repository.CosmeticIngredientRepository;
import com.ssafy12.moinsoop.skinfit.domain.ingredient.entity.Ingredient;
import com.ssafy12.moinsoop.skinfit.domain.ingredient.entity.repository.IngredientRepository;
import com.ssafy12.moinsoop.skinfit.global.ocr.dto.request.CosmeticCreateRequest;
import com.ssafy12.moinsoop.skinfit.global.ocr.dto.response.OcrResponse;
import com.ssafy12.moinsoop.skinfit.global.s3.S3Service;
import com.ssafy12.moinsoop.skinfit.infrastructure.S3Uploader;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class OCRService {
    private final S3Uploader s3Uploader;
    private final RestTemplate restTemplate;
    private final IngredientRepository ingredientRepository;
    private final CosmeticRepository cosmeticRepository;
    private final CategoryRepository categoryRepository;
    private final CosmeticIngredientRepository cosmeticIngredientRepository;

    public Integer createCosmetic(CosmeticCreateRequest request, MultipartFile ingredientImage) {

        // 1. 중복 검증
        if (cosmeticRepository.existsByCosmeticNameAndCosmeticBrand(
                request.getCosmeticName(),
                request.getCosmeticBrand()
        )) {
            throw new IllegalStateException("이미 등록된 화장품입니다.");
        }

        // 2. 카테고리 조회
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("카테고리를 찾을 수 없습니다."));

        // 3. 이미지를 s3에 업로드
        String imageUrl = s3Uploader.uploadFile(ingredientImage, "ocr");

        // 4. FastAPI에 OCR 요청 및 분석
        OcrResponse ocrResponse;
        try {
            ocrResponse = restTemplate.postForObject(
                    "https://i12b111.p.ssafy.io/ocr/img_ocr",
                    Map.of("image", imageUrl),
                    OcrResponse.class
            );
        } catch (RestClientException e) {
            log.error("이미지 ocr 분석에 실패했습니다. : {}", e.getMessage());
            throw new RuntimeException("OCR 분석 중 오류가 발생했습니다", e);
        }

        // 5. 화장품 엔티티 생성 및 저장
        Cosmetic cosmetic = Cosmetic.builder()
                .category(category)
                .cosmeticName(request.getCosmeticName())
                .cosmeticBrand(request.getCosmeticBrand())
                .cosmeticVolume(request.getCosmeticVolume())
                .imageUrl(null)
                .status(false)
                .build();

        cosmeticRepository.save(cosmetic);

        // 6. 성분처리 및 정렬
        List<String> ingredientNames = new ArrayList<>();
        for (OcrResponse.IngredientData ingredient : ocrResponse.getIngredients()) {
            String[] names = ingredient.getName().split(",");
            for (String name : names) {
                ingredientNames.add(name.trim());
            }
        }

        List<Ingredient> ingredients = ingredientRepository.findByIngredientNameIn(ingredientNames);

        List<CosmeticIngredient> cosmeticIngredients = new ArrayList<>();
        for (int i = 0; i < ingredients.size(); i++) {
            Ingredient ingredient = ingredients.get(i);
            CosmeticIngredientId id = new CosmeticIngredientId(cosmetic.getCosmeticId(), ingredient.getIngredientId());

            CosmeticIngredient cosmeticIngredient = CosmeticIngredient.builder()
                    .id(id)
                    .cosmetic(cosmetic)
                    .ingredient(ingredient)
                    .sequence(i + 1)
                    .build();

            cosmeticIngredients.add(cosmeticIngredient);
        }

        cosmeticIngredientRepository.saveAll(cosmeticIngredients);

        return cosmetic.getCosmeticId();

    }
}
