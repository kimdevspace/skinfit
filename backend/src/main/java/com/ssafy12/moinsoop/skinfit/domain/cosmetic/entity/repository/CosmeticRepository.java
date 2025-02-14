package com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.repository;

import com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.Cosmetic;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CosmeticRepository extends JpaRepository<Cosmetic, Integer> {
}
