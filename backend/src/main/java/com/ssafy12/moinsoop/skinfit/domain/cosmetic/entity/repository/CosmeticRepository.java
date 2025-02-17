package com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.repository;

import com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.Cosmetic;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CosmeticRepository extends JpaRepository<Cosmetic, Integer> {
    // 🔍 화장품 자동완성 검색 (10개 제한, 브랜드 + 화장품명 검색 가능)
    @Query("SELECT c FROM Cosmetic c " +
            "WHERE (LOWER(c.cosmeticName) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(c.cosmeticBrand) LIKE LOWER(CONCAT('%', :query, '%'))) " +
            "AND c.status = true " +
            "ORDER BY " +
            "CASE WHEN c.cosmeticBrand LIKE '[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]%' THEN 1 ELSE 2 END, " +
            "c.cosmeticBrand ASC, " +
            "c.cosmeticName ASC")
    List<Cosmetic> findTop10ByCosmeticNameOrBrandContainingIgnoreCase(@Param("query") String query, Pageable pageable);

    // 🔍 화장품 돋보기 검색 (카테고리 필터 포함, 10개 제한)
    @Query("SELECT c FROM Cosmetic c " +
            "WHERE (LOWER(c.cosmeticName) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(c.cosmeticBrand) LIKE LOWER(CONCAT('%', :query, '%'))) " +
            "AND c.status = true " +
            "AND (:category IS NULL OR c.category.categoryName = :category) " + // 카테고리 필터링
            "ORDER BY " +
            "CASE WHEN c.cosmeticBrand LIKE '[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]%' THEN 1 ELSE 2 END, " +
            "c.cosmeticBrand ASC, " +
            "c.cosmeticName ASC")
    List<Cosmetic> searchCosmetics(@Param("query") String query, @Param("category") String category, Pageable pageable);

    List<Cosmetic> findByStatusFalse();

    boolean existsByCosmeticNameAndCosmeticBrand(String cosmeticName, String cosmeticBrand);
}
