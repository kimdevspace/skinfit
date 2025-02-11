package com.ssafy12.moinsoop.skinfit.domain.experience.entity;

import com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.Cosmetic;
import com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.repository.CosmeticRepository;
import com.ssafy12.moinsoop.skinfit.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Table(name = "cosmetic_experience")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CosmeticExperience {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cosmeticExperienceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cosmetic_id", nullable = false)
    private Cosmetic cosmetic;

    @Column(nullable = false)
    private boolean isSuitable;

    @OneToMany(mappedBy = "cosmeticExperience")
    private List<CosmeticSymptom> cosmeticSymptoms = new ArrayList<>();

    @Builder
    public CosmeticExperience(User user, Cosmetic cosmetic, boolean isSuitable) {
        this.user = user;
        this.cosmetic = cosmetic;
        this.isSuitable = isSuitable;
    }

    /**
     * 화장품 경험 목록을 업데이트합니다.
     * @param user 사용자
     * @param existingExperiences 기존 화장품 경험 목록
     * @param newCosmeticIds 새로운 화장품 ID 목록
     * @param isSuitable 잘 맞는 화장품 여부
     * @param cosmeticRepository 화장품 레포지토리
     * @return 추가되어야 할 새로운 경험 목록
     */
    public static List<CosmeticExperience> updateCosmeticExperiences(
            User user,
            List<CosmeticExperience> existingExperiences,
            List<Integer> newCosmeticIds,
            boolean isSuitable,
            CosmeticRepository cosmeticRepository
    ) {
        // 1. 기존 ID 목록 추출
        Set<Integer> existingIds = existingExperiences.stream()
                .map(exp -> exp.getCosmetic().getCosmeticId())
                .collect(Collectors.toSet());

        // 2. 새로 추가할 화장품 ID 목록 (기존에 없던 것들)
        List<Integer> cosmeticsToAdd = newCosmeticIds.stream()
                .filter(id -> !existingIds.contains(id))
                .toList();

        // 3. 새로운 화장품 경험 생성
        return cosmeticsToAdd.stream()
                .map(cosmeticId -> {
                    Cosmetic cosmetic = cosmeticRepository.findById(cosmeticId)
                            .orElseThrow(() -> new IllegalArgumentException("Cosmetic not found: " + cosmeticId));
                    return CosmeticExperience.builder()
                            .user(user)
                            .cosmetic(cosmetic)
                            .isSuitable(isSuitable)
                            .build();
                })
                .collect(Collectors.toList());
    }

}