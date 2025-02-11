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

    @OneToMany(mappedBy = "cosmeticExperience", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CosmeticSymptom> cosmeticSymptoms = new ArrayList<>();

    @Builder
    public CosmeticExperience(User user, Cosmetic cosmetic, boolean isSuitable) {
        this.user = user;
        this.cosmetic = cosmetic;
        this.isSuitable = isSuitable;
    }

    public void addSymptom(CosmeticSymptom symptom) {
        this.cosmeticSymptoms.add(symptom);
        symptom.setCosmeticExperience(this);
    }
}