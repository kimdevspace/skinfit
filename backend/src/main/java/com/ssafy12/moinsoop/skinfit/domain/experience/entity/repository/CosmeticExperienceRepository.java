package com.ssafy12.moinsoop.skinfit.domain.experience.entity.repository;


import com.ssafy12.moinsoop.skinfit.domain.experience.entity.CosmeticExperience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CosmeticExperienceRepository extends JpaRepository<CosmeticExperience, Integer> {

    @Query("SELECT ce FROM CosmeticExperience ce " +
            "JOIN FETCH ce.cosmetic " +
            "WHERE ce.user.userId = :userId")
    List<CosmeticExperience> findByUserId(Integer userId);

    List<CosmeticExperience> findByUser_UserIdAndIsSuitableTrue(Integer userId);
    // CosmeticExperienceRepository
    List<CosmeticExperience> findByUser_UserIdAndIsSuitableFalse(Integer userId);
}
