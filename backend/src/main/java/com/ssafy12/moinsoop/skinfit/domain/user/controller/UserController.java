package com.ssafy12.moinsoop.skinfit.domain.user.controller;

import com.ssafy12.moinsoop.skinfit.domain.user.dto.request.*;
import com.ssafy12.moinsoop.skinfit.domain.user.dto.response.*;
import com.ssafy12.moinsoop.skinfit.domain.user.service.MyPageService;
import com.ssafy12.moinsoop.skinfit.domain.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final MyPageService myPageService;

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

    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@RequestBody SignUpRequest request) {
        userService.signUp(request);
        return ResponseEntity.ok("회원가입에 성공했습니다!");
    }

    // 비밀번호 분실 시 임시비밀번호 메일로 보내기
    @PostMapping("password-temporary")
    public ResponseEntity<String> sendTemporaryPassword(@RequestBody UserEmailRequest request) {
        userService.sendTemporaryPassword(request.getUserEmail());
        return ResponseEntity.ok("임시 비밀번호가 이메일로 발송되었습니다");
    }

    // 최초로그인 시 사용자 정보 저장
    @PostMapping("/init")
    public ResponseEntity<Void> initializeUserInfo(@AuthenticationPrincipal Integer userId,
                                                   @Valid @RequestBody RegisterUserInfoRequest request) {
        userService.initializeUserInfo(userId, request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/nickname-duplicate")
    public ResponseEntity<String> checkNicknameDuplicate(@RequestBody NicknameRequest request) {
        userService.checkDuplicateUserNickname(request.getNickname());
        return ResponseEntity.ok("사용할 수 있는 닉네임입니다.");
    }


    // 마이페이지 들어갈 때 기본정보 가져오기 (사용자 닉네임과 사용자 피부타입 가져오기)
    @GetMapping("/mypage")
    public ResponseEntity<UserNicknameAndUserSkinTypeResponse> getUserNicknameAndSkinTypes(@AuthenticationPrincipal Integer userId) {
        UserNicknameAndUserSkinTypeResponse response = myPageService.getUserNicknameAndSkinTypes(userId);
        return ResponseEntity.ok(response);
    }

    // 나와 맞지 않는 성분 TOP 3 제공
    /**
     * 레디스에 저장 된 나와 맞지 않는 성분들을 가져온 후 3개만 반환한다.
     */
    @GetMapping("/mypage/bad-ingredients-three")
    public ResponseEntity<Top3BadIngredientsResponse> getTop3BadIngredients(@AuthenticationPrincipal Integer userId) {
        Top3BadIngredientsResponse response = myPageService.getTop3BadIngredients(userId);
        return ResponseEntity.ok(response);
    }

    // 모든 안맞는 성분과 검출횟수 제공
    @GetMapping("/mypage/detail-unsuit-ingredients")
    public ResponseEntity<AllBadIngredientsResponse> getAllBadIngredients(@AuthenticationPrincipal Integer userId) {
        AllBadIngredientsResponse response = myPageService.getAllBadIngredients(userId);
        return ResponseEntity.ok(response);
    }

    // 내가 등록한 화장품 가져오기`
    @GetMapping("/mypage/cosmetics")
    public ResponseEntity<MyCosmeticsResponse> getAllMyCosmetics(@AuthenticationPrincipal Integer userId) {
        MyCosmeticsResponse response = myPageService.getAllMyCosmetics(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/mypage/ingredients")
    public ResponseEntity<MyIngredientsResponse> getAllMyIngredients(@AuthenticationPrincipal Integer userId) {
        MyIngredientsResponse response = myPageService.getAllMyIngredients(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/mypage/review")
    public ResponseEntity<MyReviewResponse> getAllMyReviews(@AuthenticationPrincipal Integer userId) {
        return ResponseEntity.ok(myPageService.getAllMyReviews(userId));
    }

    // 비밀번호 검증 후 /api/v1/user/mypage/info 로 리다이렉트
    @PostMapping("/mypage/password-verify")
    public ResponseEntity<Map<String, String>> verifyPassword(@AuthenticationPrincipal Integer userId,
                                                              @RequestBody UserPasswordRequest request) {
        String token = userService.verifyPassword(userId, request);
        return ResponseEntity.ok(Map.of("token", token));
    }

    @GetMapping("/mypage/info")
    public ResponseEntity<UserProfileResponse> getUserProfile(@AuthenticationPrincipal Integer userId,
                                                              @RequestHeader("Verification-Token") String token) {
        return ResponseEntity.ok(userService.getUserProfile(userId, token));
    }

    @PatchMapping("/mypage/info")
    public ResponseEntity<Void> updateProfile(@AuthenticationPrincipal Integer userId,
                                              @RequestHeader("Verification-Token") String token,
                                              @RequestBody UpdateProfileRequest request) {
        userService.updateProfile(userId, token, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/mypage/good-cosmetics")
    public ResponseEntity<List<CosmeticExperienceDto>> getAllSuitableCosmetics(@AuthenticationPrincipal Integer userId) {
        return ResponseEntity.ok(myPageService.getAllSuitableCosmetics(userId));
    }

    @PutMapping("/mypage/good-cosmetics")
    public ResponseEntity<Void> updateSuitableCosmetics(@AuthenticationPrincipal Integer userId,
                                                        @RequestBody List<CosmeticUpdateRequest> request) {
        myPageService.updateSuitableCosmetics(userId, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/mypage/bad-cosmetics")
    public ResponseEntity<List<CosmeticExperienceDto>> getAllUnsuitableCosmetics(@AuthenticationPrincipal Integer userId) {
        return ResponseEntity.ok(myPageService.getAllUnsuitableCosmetics(userId));
    }

    @PutMapping("/mypage/bad-cosmetics")
    public ResponseEntity<Void> updateUnsuitableCosmetics(@AuthenticationPrincipal Integer userId,
                                                        @RequestBody List<CosmeticUpdateRequest> request) {
        myPageService.updateUnsuitableCosmetics(userId, request);
        return ResponseEntity.ok().build();
    }

    // 맞는 성분조회
    @GetMapping("/mypage/good-ingredients")
    public ResponseEntity<List<IngredientExperienceDto>> getSuitableIngredients(@AuthenticationPrincipal Integer userId) {
        return ResponseEntity.ok(myPageService.getAllSuitableIngredients(userId));
    }

    // 맞는 성분 수정
    @PutMapping("/mypage/good-ingredients")
    public ResponseEntity<Void> updateSuitableIngredients(@AuthenticationPrincipal Integer userId,
                                                          @RequestBody List<IngredientUpdateRequest> request) {
        myPageService.updateSuitableIngredients(userId, request);
        return ResponseEntity.ok().build();
    }

    // 안 맞는 성분 조회
    @GetMapping("/mypage/bad-ingredients")
    public ResponseEntity<List<IngredientExperienceDto>> getUnsuitableIngredients(@AuthenticationPrincipal Integer userId) {
        return ResponseEntity.ok(myPageService.getAllUnsuitableIngredients(userId));
    }

    // 안 맞는 성분 수정
    // 안맞는 성분 목록 수정
    @PutMapping("/mypage/bad-ingredients")
    public ResponseEntity<Void> updateUnsuitableIngredients(@AuthenticationPrincipal Integer userId,
                                                            @RequestBody List<IngredientUpdateRequest> request) {
        myPageService.updateUnsuitableIngredients(userId, request);
        return ResponseEntity.ok().build();
    }


}
