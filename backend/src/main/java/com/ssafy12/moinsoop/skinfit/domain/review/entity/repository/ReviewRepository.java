package com.ssafy12.moinsoop.skinfit.domain.review.entity.repository;

import com.ssafy12.moinsoop.skinfit.domain.review.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    // cosmeticId 기준 조회
    Page<Review> findByCosmetic_CosmeticId(Integer cosmeticId, Pageable pageable);

    // cosmeticId & 피부 타입을 기준으로 조회
    @Query("SELECT r FROM Review r WHERE r.cosmetic.cosmeticId = :cosmeticId AND EXISTS (SELECT ust FROM UserSkinType ust WHERE ust.user = r.user AND ust.skinType.typeName = :skinType)")
    Page<Review> findCustomReviews(Integer cosmeticId, String skinType, Pageable pageable);

    // 커스텀 조회: 리뷰 작성자의 피부 타입이 사용자의 피부 타입 집합(userSkinTypeIds)을 모두 포함하는 리뷰
    @Query("SELECT r FROM Review r " +
            "JOIN r.user u " +
            "JOIN UserSkinType ust ON ust.user = u " +
            "WHERE r.cosmetic.cosmeticId = :cosmeticId " +
            "GROUP BY r " +
            "HAVING COUNT(CASE WHEN ust.skinType.typeId IN :userSkinTypeIds THEN 1 END) = :userSkinTypeCount")
    Page<Review> findCustomReviews(Integer cosmeticId, List<Integer> userSkinTypeIds, long userSkinTypeCount, Pageable pageable);
}



