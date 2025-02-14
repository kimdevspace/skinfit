package com.ssafy12.moinsoop.skinfit.domain.ingredient.entity.repository;

import com.ssafy12.moinsoop.skinfit.domain.ingredient.entity.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IngredientRepository extends JpaRepository<Ingredient, Integer> {
    List<Ingredient> findByIngredientIdIn(List<Integer> ingredientIds);

    // 성분명을 검색 (대소문자 무시)
    List<Ingredient> findByIngredientNameContainingIgnoreCase(String ingredientName);
}
