package com.ssafy12.moinsoop.skinfit.global.oauth.controller;

import com.ssafy12.moinsoop.skinfit.domain.auth.dto.response.TokenResponse;
import com.ssafy12.moinsoop.skinfit.domain.user.entity.User;
import com.ssafy12.moinsoop.skinfit.global.config.RefreshTokenService;
import com.ssafy12.moinsoop.skinfit.global.oauth.dto.KakaoTokenResponse;
import com.ssafy12.moinsoop.skinfit.global.oauth.dto.KakaoUserInfo;
import com.ssafy12.moinsoop.skinfit.global.oauth.service.KaKaoOAuthService;
import com.ssafy12.moinsoop.skinfit.global.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.antlr.v4.runtime.Token;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.net.URI;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class KakaoOAuthController {
    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.kakao.redirect-uri}")
    private String redirectUri;

    @Value("${spring.security.oauth2.client.provider.kakao.authorization-uri}")
    private String authUri;

    @Value("${spring.security.oauth2.client.registration.kakao.client-secret}")
    private String clientSecret;

    private final RestTemplate restTemplate;
    private final KaKaoOAuthService kakaoOAuthService;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;

    @GetMapping("/oauth/kakao/login")
    public ResponseEntity<Void> kakaoLogin() {
        String kakaoAuthUrl = authUri +
                "?client_id=" + clientId +
                "&redirect_uri=" + redirectUri +
                "&response_type=code" +
                "&prompt=login";

        return ResponseEntity.status(302)
                .location(URI.create(kakaoAuthUrl))
                .build();
    }

    @GetMapping("/login/oauth2/code/kakao")
    public ResponseEntity<?> kakaoCallback(@RequestParam String code) {
        log.info("인가 코드: {}", code);

        // 토큰 요청을 위한 헤더 설정
        HttpHeaders tokenHeaders = new HttpHeaders();
        tokenHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        // 토큰 요청을 위한 폼 데이터 설정
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", clientId);
        params.add("redirect_uri", redirectUri);
        params.add("code", code);
        params.add("client_secret", clientSecret);

        try {
            // 카카오 토큰 받기
            ResponseEntity<KakaoTokenResponse> tokenResponse = restTemplate.postForEntity(
                    "https://kauth.kakao.com/oauth/token",
                    new HttpEntity<>(params, tokenHeaders),
                    KakaoTokenResponse.class
            );

            if (tokenResponse.getBody() != null) {
                // 사용자 정보 요청을 위한 헤더 설정
                HttpHeaders userInfoHeaders = new HttpHeaders();
                userInfoHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
                userInfoHeaders.setBearerAuth(tokenResponse.getBody().getAccessToken());

                System.out.println(tokenResponse.getBody().getAccessToken());

                // 사용자 정보 요청
                ResponseEntity<KakaoUserInfo> userInfoResponse = restTemplate.exchange(
                        "https://kapi.kakao.com/v2/user/me",
                        HttpMethod.GET,
                        new HttpEntity<>(userInfoHeaders),
                        KakaoUserInfo.class
                );

                if (userInfoResponse.getBody() != null) {
                    KakaoUserInfo kakaoUser = userInfoResponse.getBody();
                    // 회원가입 또는 로그인 처리
                    User user = kakaoOAuthService.registerOrLogin(kakaoUser);
                    boolean isRegistered = user.isRegistered();
                    log.info("로그인 성공! 유저 이메일: {}, 닉네임: {}", user.getUserEmail(), user.getNickname());


                    String jwtAccessToken = jwtTokenProvider.generateAccessToken(user.getUserId(), user.getRoleType());
                    String jwtRefreshToken = jwtTokenProvider.generateRefreshToken(user.getUserId(), user.getRoleType());

                    refreshTokenService.saveRefreshToken(user.getUserId(), jwtRefreshToken);

                    return ResponseEntity.ok("로그인 성공!, 액세스토큰 : " + jwtAccessToken + "최초 로그인 여부 : " + isRegistered);
                }
            }

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("토큰 응답이 비어있습니다.");

        } catch (Exception e) {
            log.error("카카오 로그인 실패", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("카카오 로그인 실패: " + e.getMessage());
        }
    }

}