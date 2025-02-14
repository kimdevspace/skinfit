package com.ssafy12.moinsoop.skinfit.domain.cosmetic_ingredient.entity.repository;

import com.ssafy12.moinsoop.skinfit.domain.cosmetic_ingredient.entity.CosmeticIngredient;
import com.ssafy12.moinsoop.skinfit.domain.cosmetic_ingredient.entity.CosmeticIngredientId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CosmeticIngredientRepository extends JpaRepository<CosmeticIngredient, CosmeticIngredientId> {
}
