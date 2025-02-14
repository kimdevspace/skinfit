package com.ssafy12.moinsoop.skinfit.domain.review.entity.repository;

import com.ssafy12.moinsoop.skinfit.domain.review.entity.Review;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {

    // 사용자가 작성한 리뷰 조회
    List<Review> findByUser_UserIdOrderByCreatedAtDesc(Integer userId);
    // 기본 조회: cosmeticId 기준, 최신순 (createdAt 내림차순)
    Page<Review> findByCosmetic_CosmeticIdOrderByCreatedAtDesc(Integer cosmeticId, Pageable pageable);
    // 기본 조회: cosmeticId 기준, 좋아요 순 (reviewLikes 내림차순)
    @Query("SELECT r FROM Review r WHERE r.cosmetic.cosmeticId = :cosmeticId ORDER BY SIZE(r.reviewLikes) DESC")
    Page<Review> findByCosmetic_CosmeticIdOrderByLikesDesc(@Param("cosmeticId") Integer cosmeticId, Pageable pageable);

    // 커스텀 조회: 내 피부 맞춤 리뷰 (최신순)
    @Query("SELECT r FROM Review r " +
            "WHERE r.cosmetic.cosmeticId = :cosmeticId " +
            "  AND EXISTS (SELECT ust FROM UserSkinType ust " +
            "              WHERE ust.user = r.user " +
            "                AND ust.skinType.typeId IN :userSkinTypeIds) " +
            "ORDER BY r.createdAt DESC")
    Page<Review> findCustomReviewsOrderByCreatedAtDesc(@Param("cosmeticId") Integer cosmeticId,
                                                       @Param("userSkinTypeIds") List<Integer> userSkinTypeIds,
                                                       Pageable pageable);

    // 커스텀 조회: 내 피부 맞춤 리뷰 (좋아요 순)
    @Query("SELECT r FROM Review r " +
            "WHERE r.cosmetic.cosmeticId = :cosmeticId " +
            "  AND EXISTS (SELECT ust FROM UserSkinType ust " +
            "              WHERE ust.user = r.user " +
            "                AND ust.skinType.typeId IN :userSkinTypeIds) " +
            "ORDER BY SIZE(r.reviewLikes) DESC")
    Page<Review> findCustomReviewsOrderByLikesDesc(@Param("cosmeticId") Integer cosmeticId,
                                                   @Param("userSkinTypeIds") List<Integer> userSkinTypeIds,
                                                   Pageable pageable);
}

