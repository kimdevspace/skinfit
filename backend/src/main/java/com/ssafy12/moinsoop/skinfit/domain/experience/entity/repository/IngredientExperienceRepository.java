package com.ssafy12.moinsoop.skinfit.domain.experience.entity.repository;

import com.ssafy12.moinsoop.skinfit.domain.experience.entity.IngredientExperience;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface IngredientExperienceRepository extends JpaRepository<IngredientExperience, Integer> {
    @Query("SELECT i.ingredientName as name, COUNT(ie) as count " +
            "FROM IngredientExperience ie " +
            "JOIN ie.ingredient i " +
            "WHERE ie.user.userId = :userId " +
            "AND ie.isSuitable = false " +
            "GROUP BY i.ingredientName " +
            "ORDER BY count DESC")
    List<Object[]> findTop3UnSuitableIngredientsWithCount(Integer userId, Pageable pageable);
}
