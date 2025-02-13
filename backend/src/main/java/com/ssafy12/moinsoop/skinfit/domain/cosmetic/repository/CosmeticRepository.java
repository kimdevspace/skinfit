package com.ssafy12.moinsoop.skinfit.domain.cosmetic.repository;

import com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.Cosmetic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CosmeticRepository extends JpaRepository<Cosmetic, Integer> {

    // 🔍 화장품 자동완성 검색 (10개 제한, 브랜드명 + 화장품명 검색 가능, 브랜드 > 이름 정렬, 한글 > 영어 정렬)
    @Query("SELECT c FROM Cosmetic c " +
            "WHERE (LOWER(c.cosmeticName) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(c.cosmeticBrand) LIKE LOWER(CONCAT('%', :query, '%'))) " + // 브랜드명도 검색 대상 포함
            "AND c.status = true " +
            "ORDER BY " +
            "CASE WHEN c.cosmeticBrand LIKE '[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]%' THEN 1 ELSE 2 END, " + // 한글 브랜드 먼저 정렬
            "c.cosmeticBrand ASC, " + // 브랜드명 오름차순 정렬
            "c.cosmeticName ASC") // 화장품명 오름차순 정렬
    List<Cosmetic> findTop10ByCosmeticNameOrBrandContainingIgnoreCase(@Param("query") String query);
}
