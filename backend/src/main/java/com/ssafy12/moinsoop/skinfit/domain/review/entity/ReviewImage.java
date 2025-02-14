package com.ssafy12.moinsoop.skinfit.domain.review.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "review_image")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ReviewImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer imageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    private Review review;

    @Column(nullable = false, length = 200)
    private String imageUrl;

    @Column(nullable = false)
    private int sequence;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Builder
    public ReviewImage(Review review, String imageUrl, int sequence) {
        this.review = review;
        this.imageUrl = imageUrl;
        this.sequence = sequence;
        this.createdAt = LocalDateTime.now(); // 생성 시 현재 시간 자동 설정
    }
}
