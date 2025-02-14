package com.ssafy12.moinsoop.skinfit.domain.review.entity.repository;

import com.ssafy12.moinsoop.skinfit.domain.review.entity.ReviewLike;
import com.ssafy12.moinsoop.skinfit.domain.review.entity.ReviewLikeId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewLikeRepository extends JpaRepository<ReviewLike, ReviewLikeId> {
    List<ReviewLike> findByUser_UserId(Integer userId);
}
