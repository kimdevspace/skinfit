package com.ssafy12.moinsoop.skinfit.domain.auth.controller;

import com.ssafy12.moinsoop.skinfit.domain.auth.dto.request.LoginRequest;
import com.ssafy12.moinsoop.skinfit.domain.auth.dto.response.TokenResponse;
import com.ssafy12.moinsoop.skinfit.domain.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signin")
    public ResponseEntity<TokenResponse> signIn(@RequestBody @Valid LoginRequest request) {
        return ResponseEntity.ok(authService.signIn(request));
    }

    @PostMapping("/reissue")
    public ResponseEntity<TokenResponse> reissue(@RequestHeader("Refresh-Token") String refreshToken) {
        return ResponseEntity.ok(authService.reissue(refreshToken));
    }
}
