package com.ssafy12.moinsoop.skinfit.domain.cosmetic.repository;

import com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.Cosmetic;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CosmeticRepository extends JpaRepository<Cosmetic, Integer> {

    // 🔍 화장품 자동완성 검색 (최대 10개 제한, 가나다 순)
    @Query("SELECT c FROM Cosmetic c WHERE LOWER(c.cosmeticName) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "AND c.status = true ORDER BY c.cosmeticName ASC")
    Page<Cosmetic> findByCosmeticNameContainingIgnoreCase(@Param("query") String query, Pageable pageable);
}
