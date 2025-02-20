package com.ssafy12.moinsoop.skinfit.domain.review.entity;

import com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.Cosmetic;
import com.ssafy12.moinsoop.skinfit.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "review")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer reviewId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cosmetic_id", nullable = false)
    private Cosmetic cosmetic;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private int reportCount;

    @Column(nullable = false)
    private int score;

    @OneToMany(mappedBy = "review", cascade = CascadeType.REMOVE)
    private List<ReviewLike> reviewLikes = new ArrayList<>();

    @OneToMany(mappedBy = "review", cascade = CascadeType.REMOVE)
    private List<ReviewReport> reviewReports = new ArrayList<>();

    @OneToMany(mappedBy = "review", cascade = CascadeType.REMOVE)
    private List<ReviewImage> reviewImages = new ArrayList<>();

    @Builder
    public Review(User user, Cosmetic cosmetic, int score, String content) {
        this.user = user;
        this.cosmetic = cosmetic;
        this.content = content;
        this.score = score;
        this.createdAt = LocalDateTime.now();
    }

    public void updateReview(String reviewContent, int score){
        this.content = reviewContent;
        this.score = score;
        // 업데이트 날짜는 따로 없는지?
    }

    // 신고 횟수 증가
    public void incrementReportCount() {
        this.reportCount++;
    }
}
