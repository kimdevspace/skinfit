package com.ssafy12.moinsoop.skinfit.domain.ingredient.controller;

import com.ssafy12.moinsoop.skinfit.domain.ingredient.dto.IngredientAutoCompleteDto;
import com.ssafy12.moinsoop.skinfit.domain.ingredient.dto.IngredientSearchDto;
import com.ssafy12.moinsoop.skinfit.domain.ingredient.service.IngredientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class IngredientController {

    private final IngredientService ingredientService;

    // ✅ 성분 자동완성 검색 API (10개 제한, 가나다 > 알파벳 순)
    @GetMapping("/search/ingredients/autocomplete")
    public ResponseEntity<List<IngredientAutoCompleteDto>> autoCompleteIngredient(
            @RequestParam String query) {
        return ResponseEntity.ok(ingredientService.autoCompleteIngredient(query));
    }

    @GetMapping("/search/ingredients/result")
    public ResponseEntity<List<IngredientAutoCompleteDto>> autoCompleteIngredientDetail(
            @RequestParam String query) {
        return ResponseEntity.ok(ingredientService.autoCompleteIngredient(query));
    }


    @GetMapping("/{cosmeticId}/details")
    public ResponseEntity<IngredientSearchDto> getIngredientDetails(@PathVariable Integer cosmeticId) {
        return ResponseEntity.ok(ingredientService.getIngredientDetails(cosmeticId));
    }

}