package com.ssafy12.moinsoop.skinfit;

import com.ssafy12.moinsoop.skinfit.domain.auth.dto.response.TokenResponse;
import com.ssafy12.moinsoop.skinfit.domain.auth.service.AuthService;
import com.ssafy12.moinsoop.skinfit.domain.user.entity.enums.RoleType;
import com.ssafy12.moinsoop.skinfit.global.config.RefreshTokenService;
import com.ssafy12.moinsoop.skinfit.global.security.JwtTokenProvider;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private JwtTokenProvider jwtTokenProvider;
    @Mock
    private RefreshTokenService refreshTokenService;
    @InjectMocks
    private AuthService authService;

    @Test
    @DisplayName("토큰 재발급 성공 테스트")
    void reissueTokenSuccess() {
        // given
        Integer userId = 1;
        RoleType roleType = RoleType.USER;
        String oldRefreshToken = "old_refresh_token";
        String newAccessToken = "new_access_token";
        String newRefreshToken = "new_refresh_token";

        // 토큰 검증 모킹
        when(jwtTokenProvider.validateToken(oldRefreshToken)).thenReturn(true);

        // 클레임 모킹
        Claims claims = Mockito.mock(Claims.class);
        when(claims.get("userId", Integer.class)).thenReturn(userId);
        when(claims.get("roleType", String.class)).thenReturn(roleType.name());
        when(jwtTokenProvider.getClaims(oldRefreshToken)).thenReturn(claims);

        // 저장된 리프레시 토큰 모킹
        when(refreshTokenService.getRefreshToken(userId)).thenReturn(oldRefreshToken);

        // 새 토큰 생성 모킹
        when(jwtTokenProvider.generateAccessToken(userId, roleType)).thenReturn(newAccessToken);
        when(jwtTokenProvider.generateRefreshToken(userId, roleType)).thenReturn(newRefreshToken);

        // when
        TokenResponse response = authService.reissue(oldRefreshToken);

        // then
        assertThat(response.getAccessToken()).isEqualTo(newAccessToken);
        assertThat(response.getRefreshToken()).isEqualTo(newRefreshToken);

        // 검증
        verify(refreshTokenService).saveRefreshToken(userId, newRefreshToken);
    }

    @Test
    @DisplayName("유효하지 않은 토큰으로 재발급 요청 시 예외 발생")
    void reissueTokenFailWithInvalidToken() {
        // given
        String invalidRefreshToken = "invalid_refresh_token";

        // 토큰 검증 모킹
        when(jwtTokenProvider.validateToken(invalidRefreshToken)).thenReturn(false);

        // when, then
        assertThatThrownBy(() -> authService.reissue(invalidRefreshToken))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("유효하지 않은 토큰입니다.");
    }

    @Test
    @DisplayName("저장된 리프레시 토큰과 불일치할 때 예외 발생")
    void reissueTokenFailWithMismatchedToken() {
        // given
        Integer userId = 1;
        RoleType roleType = RoleType.USER;
        String oldRefreshToken = "old_refresh_token";
        String differentToken = "different_token";

        // 토큰 검증 모킹
        when(jwtTokenProvider.validateToken(oldRefreshToken)).thenReturn(true);

        // 클레임 모킹
        Claims claims = Mockito.mock(Claims.class);
        when(claims.get("userId", Integer.class)).thenReturn(userId);
        when(claims.get("roleType", String.class)).thenReturn(roleType.name());
        when(jwtTokenProvider.getClaims(oldRefreshToken)).thenReturn(claims);

        // 저장된 리프레시 토큰 모킹
        when(refreshTokenService.getRefreshToken(userId)).thenReturn(differentToken);

        // when, then
        assertThatThrownBy(() -> authService.reissue(oldRefreshToken))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("저장된 리프레시 토큰과 일치하지 않습니다.");
    }
}
