package com.ssafy12.moinsoop.skinfit.domain.ingredient.entity.repository;

import com.ssafy12.moinsoop.skinfit.domain.ingredient.entity.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IngredientRepository extends JpaRepository<Ingredient, Integer> {
}
