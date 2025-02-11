package com.ssafy12.moinsoop.skinfit.domain.experience.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cosmetic_symptom")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CosmeticSymptom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cosmeticSymptomId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cosmetic_experience_id", nullable = false)
    private CosmeticExperience cosmeticExperience;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "symptom_id", nullable = false)
    private Symptom symptom;

    @Builder
    public CosmeticSymptom(CosmeticExperience cosmeticExperience, Symptom symptom) {
        this.cosmeticExperience = cosmeticExperience;
        this.symptom = symptom;
    }
}
