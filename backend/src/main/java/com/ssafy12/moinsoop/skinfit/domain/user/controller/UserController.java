package com.ssafy12.moinsoop.skinfit.domain.user.controller;

import com.ssafy12.moinsoop.skinfit.domain.user.dto.request.EmailVerificationRequest;
import com.ssafy12.moinsoop.skinfit.domain.user.dto.request.SignUpRequest;
import com.ssafy12.moinsoop.skinfit.domain.user.dto.request.UserEmailRequest;
import com.ssafy12.moinsoop.skinfit.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 이메일 중복확인
    @PostMapping("/email-duplicate")
    public ResponseEntity<String> checkDuplicateUserEmail(@RequestBody UserEmailRequest request) {
        userService.checkDuplicateUserEmail(request.getUserEmail());
        return ResponseEntity.ok("가입할 수 있는 이메일입니다.");
    }

    // 이메일 보내기
    @PostMapping("/email-verification")
    public ResponseEntity<String> sendVerificationEmail(@RequestBody UserEmailRequest request) {
        userService.sendVerificationEmail(request.getUserEmail());
        return ResponseEntity.ok("인증 코드가 이메일로 발송되었습니다");
    }
}
