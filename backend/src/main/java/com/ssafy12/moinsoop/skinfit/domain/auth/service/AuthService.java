package com.ssafy12.moinsoop.skinfit.domain.auth.service;

import com.ssafy12.moinsoop.skinfit.domain.auth.dto.request.LoginRequest;
import com.ssafy12.moinsoop.skinfit.domain.auth.dto.response.TokenResponse;
import com.ssafy12.moinsoop.skinfit.domain.user.entity.User;
import com.ssafy12.moinsoop.skinfit.domain.user.entity.enums.RoleType;
import com.ssafy12.moinsoop.skinfit.domain.user.entity.repository.UserRepository;
import com.ssafy12.moinsoop.skinfit.global.config.RefreshTokenService;
import com.ssafy12.moinsoop.skinfit.global.security.JwtTokenProvider;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;

    public TokenResponse signIn(LoginRequest request) {
        User user = userRepository.findByUserEmail(request.getUserEmail())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 이메일입니다."));

        if (!passwordEncoder.matches(request.getUserPassword(), user.getUserPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        String accessToken = jwtTokenProvider.generateAccessToken(user.getUserId(), user.getRoleType());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getUserId(), user.getRoleType());

        refreshTokenService.saveRefreshToken(user.getUserId(), refreshToken);

        return new TokenResponse(accessToken, null);
    }

    public TokenResponse reissue(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new IllegalArgumentException("유효하지 않은 토큰입니다.");
        }

        Claims claims = jwtTokenProvider.getClaims(refreshToken);
        Integer userId = claims.get("userId", Integer.class);
        RoleType roleType = RoleType.valueOf(claims.get("roleType", String.class));

        String savedRefreshToken = refreshTokenService.getRefreshToken(userId);
        if (!refreshToken.equals(savedRefreshToken)) {
            throw new IllegalArgumentException("저장된 리프레시 토큰과 일치하지 않습니다.");
        }

        String newAccessToken = jwtTokenProvider.generateAccessToken(userId, roleType);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(userId, roleType);

        refreshTokenService.saveRefreshToken(userId, newRefreshToken);

        return new TokenResponse(newAccessToken, newRefreshToken);
    }
}
