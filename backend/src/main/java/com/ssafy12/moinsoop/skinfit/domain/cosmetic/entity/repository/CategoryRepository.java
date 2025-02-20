package com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.repository;

import com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
}
