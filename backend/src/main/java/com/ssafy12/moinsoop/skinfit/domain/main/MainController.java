package com.ssafy12.moinsoop.skinfit.domain.main;

import com.ssafy12.moinsoop.skinfit.domain.user.dto.response.MainPageResponse;
import com.ssafy12.moinsoop.skinfit.domain.user.service.MainPageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class MainController {

    private final MainPageService mainPageService;

    @GetMapping("/mainpage")
    public ResponseEntity<MainPageResponse> getMainPage(@AuthenticationPrincipal Integer userId) {
        MainPageResponse response = mainPageService.getMainPage(userId);
        return ResponseEntity.ok(response);
    }

}
