package com.ssafy12.moinsoop.skinfit.domain.ingredient.repository;

import com.ssafy12.moinsoop.skinfit.domain.ingredient.entity.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IngredientRepository extends JpaRepository<Ingredient, Integer> {

    // 🔍 성분 자동완성 검색 (10개 제한, 가나다순)
    @Query("SELECT i FROM Ingredient i WHERE LOWER(i.ingredientName) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "AND i.status = true ORDER BY i.ingredientName ASC")
    List<Ingredient> findTop10ByIngredientNameContainingIgnoreCase(@Param("query") String query);
}
