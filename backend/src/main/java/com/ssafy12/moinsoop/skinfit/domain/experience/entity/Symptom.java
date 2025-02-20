package com.ssafy12.moinsoop.skinfit.domain.experience.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "symptom")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Symptom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer symptomId;

    @Column(nullable = false, length = 50)
    private String name;

    @OneToMany(mappedBy = "symptom")
    private List<CosmeticSymptom> cosmeticSymptoms = new ArrayList<>();

    @OneToMany(mappedBy = "symptom")
    private List<IngredientSymptom> ingredientSymptoms = new ArrayList<>();
}
