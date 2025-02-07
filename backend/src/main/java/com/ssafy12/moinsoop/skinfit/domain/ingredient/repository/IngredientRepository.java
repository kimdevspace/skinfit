package com.ssafy12.moinsoop.skinfit.domain.ingredient.repository;

import com.ssafy12.moinsoop.skinfit.domain.ingredient.entity.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Integer> {

    // 성분명을 검색 (대소문자 무시)
    List<Ingredient> findByIngredientNameContainingIgnoreCase(String ingredientName);
}
