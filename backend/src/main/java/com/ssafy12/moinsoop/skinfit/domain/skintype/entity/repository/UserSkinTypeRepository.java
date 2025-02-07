package com.ssafy12.moinsoop.skinfit.domain.skintype.entity.repository;

import com.ssafy12.moinsoop.skinfit.domain.skintype.entity.UserSkinType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserSkinTypeRepository extends JpaRepository<UserSkinType, Integer> {
    List<UserSkinType> findAllByUser_UserId(Integer userId);
}
