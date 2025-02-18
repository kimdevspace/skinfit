package com.ssafy12.moinsoop.skinfit.domain.auth.controller;

import com.ssafy12.moinsoop.skinfit.domain.auth.dto.request.LoginRequest;
import com.ssafy12.moinsoop.skinfit.domain.auth.dto.response.SignInResponse;
import com.ssafy12.moinsoop.skinfit.domain.auth.dto.response.TokenResponse;
import com.ssafy12.moinsoop.skinfit.domain.auth.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signin")
    public ResponseEntity<SignInResponse> signIn(@RequestBody @Valid LoginRequest request,
                                                 HttpServletResponse response) {

        SignInResponse signInResponse = authService.signIn(request);

        ResponseCookie refreshTokenCookie = ResponseCookie.from("refresh_token", signInResponse.getRefreshToken())
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path("/")
                .maxAge(Duration.ofSeconds(604800))
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());

        signInResponse.setRefreshToken(null);

        return ResponseEntity.ok(signInResponse);
    }

    @PostMapping("/reissue")
    public ResponseEntity<TokenResponse> reissue(@CookieValue("refresh_token") String refreshToken,
                                                 HttpServletResponse response) {
        TokenResponse tokenResponse = authService.reissue(refreshToken);

        // 새로운 리프레시 토큰을 쿠키에 설정
        ResponseCookie refreshTokenCookie = ResponseCookie.from("refresh_token", tokenResponse.getRefreshToken())
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path("/")
                .maxAge(Duration.ofSeconds(604800))
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());

        // 쿠키로 전송된 refreshToken은 응답 바디에서 제거
        tokenResponse.setRefreshToken(null);

        return ResponseEntity.ok(tokenResponse);
    }

    @DeleteMapping("/logout")
    public ResponseEntity<Void> logout(@AuthenticationPrincipal Integer userId) {
        authService.logout(userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/withdraw")
    public ResponseEntity<String> withdraw(@AuthenticationPrincipal Integer userId) {
        authService.withdraw(userId);
        return ResponseEntity.ok("회원탈퇴 완료");
    }
}
