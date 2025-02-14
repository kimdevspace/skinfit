package com.ssafy12.moinsoop.skinfit.domain.cosmetic_ingredient.entity.repository;

import com.ssafy12.moinsoop.skinfit.domain.cosmetic_ingredient.entity.CosmeticIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CosmeticIngredientRepository extends JpaRepository<CosmeticIngredient, Integer> {

    // 🔍 특정 화장품의 성분 리스트 조회 (검수 완료된 성분만)
    @Query("SELECT ci FROM CosmeticIngredient ci WHERE ci.cosmetic.cosmeticId = :cosmeticId " +
            "AND ci.ingredient.status = true ORDER BY ci.sequence ASC")
    List<CosmeticIngredient> findByCosmeticId(@Param("cosmeticId") Integer cosmeticId);
}