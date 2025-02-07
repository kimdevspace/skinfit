package com.ssafy12.moinsoop.skinfit.domain.user.service;

import com.ssafy12.moinsoop.skinfit.domain.skintype.entity.SkinType;
import com.ssafy12.moinsoop.skinfit.domain.skintype.entity.UserSkinType;
import com.ssafy12.moinsoop.skinfit.domain.skintype.entity.repository.UserSkinTypeRepository;
import com.ssafy12.moinsoop.skinfit.domain.user.dto.response.UserNicknameAndUserSkinTypeResponse;
import com.ssafy12.moinsoop.skinfit.domain.user.entity.User;
import com.ssafy12.moinsoop.skinfit.domain.user.entity.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class MyPageService {

    private final UserRepository userRepository;
    private final UserSkinTypeRepository userSkinTypeRepository;

    @Transactional(readOnly = true)
    public UserNicknameAndUserSkinTypeResponse getUserNicknameAndSkinTypes(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다"));

        // 사용자의 스킨 타입들
        List<String> userSkinTypes = userSkinTypeRepository.findAllByUser_UserId(userId)
                .stream()
                .map(UserSkinType::getSkinType)
                .map(SkinType::getTypeName)
                .toList();

        // 응답 객체 반환
        return new UserNicknameAndUserSkinTypeResponse(user.getNickname(), userSkinTypes);
    }
}
