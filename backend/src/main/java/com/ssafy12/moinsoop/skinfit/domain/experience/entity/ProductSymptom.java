package com.ssafy12.moinsoop.skinfit.domain.experience.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "product_symptom")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProductSymptom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer productSymptomId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_experience_id", nullable = false)
    private ProductExperience productExperience;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "symptom_id", nullable = false)
    private Symptom symptom;
}
