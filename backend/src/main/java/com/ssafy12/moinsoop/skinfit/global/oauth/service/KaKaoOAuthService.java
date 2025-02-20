package com.ssafy12.moinsoop.skinfit.global.oauth.service;

import com.ssafy12.moinsoop.skinfit.domain.user.entity.User;
import com.ssafy12.moinsoop.skinfit.domain.user.entity.enums.ProviderType;
import com.ssafy12.moinsoop.skinfit.domain.user.entity.enums.RoleType;
import com.ssafy12.moinsoop.skinfit.domain.user.entity.repository.UserRepository;
import com.ssafy12.moinsoop.skinfit.global.oauth.dto.KakaoUserInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class KaKaoOAuthService {

    private final UserRepository userRepository;

    @Transactional
    public User registerOrLogin(KakaoUserInfo kakaoUserInfo) {
        String kakaoId = String.valueOf(kakaoUserInfo.getId());
        String email = kakaoId + "@kakao";

        return userRepository.findByUserEmail(email)
                .orElseGet(() -> registerKakaoUser(kakaoUserInfo));
    }

    private User registerKakaoUser(KakaoUserInfo kakaoUserInfo) {
        System.out.println("회원가입을 진행한다.");
        String kakaoId = String.valueOf(kakaoUserInfo.getId());

        User user = User.builder()
                .userEmail(kakaoId + "@kakao")
                .userPassword("KAKAO_" + kakaoId)
                .nickname(kakaoUserInfo.getProperties().getNickname())
                .providerType(ProviderType.KAKAO)
                .roleType(RoleType.USER)
                .isRegistered(false)
                .build();

        return userRepository.save(user);
    }
}
