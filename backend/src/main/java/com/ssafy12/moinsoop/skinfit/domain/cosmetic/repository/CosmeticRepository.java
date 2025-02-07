package com.ssafy12.moinsoop.skinfit.domain.cosmetic.repository;

import com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.Cosmetic;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CosmeticRepository extends JpaRepository<Cosmetic, Integer> {
    List<Cosmetic> findByCosmeticNameContainingIgnoreCase(String query);
}