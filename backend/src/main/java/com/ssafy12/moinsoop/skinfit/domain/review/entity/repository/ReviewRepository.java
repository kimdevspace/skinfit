package com.ssafy12.moinsoop.skinfit.domain.review.entity.repository;

import com.ssafy12.moinsoop.skinfit.domain.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByUser_UserIdOrderByCreatedAtDesc(Integer userId);
}
