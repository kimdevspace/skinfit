package com.ssafy12.moinsoop.skinfit.domain.user.entity.repository;

import com.ssafy12.moinsoop.skinfit.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUserEmail(String userEmail);
    boolean existsByUserEmail(String userEmail);
}
