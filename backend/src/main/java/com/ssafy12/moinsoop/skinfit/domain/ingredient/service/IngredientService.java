package com.ssafy12.moinsoop.skinfit.domain.ingredient.service;

import com.ssafy12.moinsoop.skinfit.domain.ingredient.dto.IngredientAutoCompleteDto;
import com.ssafy12.moinsoop.skinfit.domain.ingredient.dto.IngredientSearchDto;
import com.ssafy12.moinsoop.skinfit.domain.ingredient.entity.Ingredient;
import com.ssafy12.moinsoop.skinfit.domain.ingredient.entity.repository.IngredientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IngredientService {

    private final IngredientRepository ingredientRepository;

    public List<IngredientAutoCompleteDto> autoCompleteIngredient(String query) {
        if (query == null || query.trim().isEmpty()) {
            return List.of(); // 쿼리가 없으면 빈 리스트 반환
        }

        List<Ingredient> ingredients = ingredientRepository.findTop10ByIngredientNameContainingIgnoreCase(query);

        return ingredients.stream()
                .map(i -> new IngredientAutoCompleteDto(i.getIngredientId(), i.getIngredientName()))
                .collect(Collectors.toList());
    }





    public IngredientSearchDto getIngredientDetails(Integer cosmeticId) {
        return new IngredientSearchDto(ingredientRepository.findIngredientsByCosmeticId(cosmeticId));
    }




}