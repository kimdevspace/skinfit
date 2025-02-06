package com.ssafy12.moinsoop.skinfit.domain.review.repository;

import com.ssafy12.moinsoop.skinfit.domain.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
}

