package com.ssafy12.moinsoop.skinfit.domain.user.service;

import com.ssafy12.moinsoop.skinfit.domain.skintype.entity.SkinType;
import com.ssafy12.moinsoop.skinfit.domain.skintype.entity.UserSkinType;
import com.ssafy12.moinsoop.skinfit.domain.skintype.entity.repository.SkinTypeRepository;
import com.ssafy12.moinsoop.skinfit.domain.skintype.entity.repository.UserSkinTypeRepository;
import com.ssafy12.moinsoop.skinfit.domain.user.dto.request.RegisterUserInfoRequest;
import com.ssafy12.moinsoop.skinfit.domain.user.dto.request.SignUpRequest;
import com.ssafy12.moinsoop.skinfit.domain.user.entity.User;
import com.ssafy12.moinsoop.skinfit.domain.user.entity.enums.ProviderType;
import com.ssafy12.moinsoop.skinfit.domain.user.entity.enums.RoleType;
import com.ssafy12.moinsoop.skinfit.domain.user.entity.repository.UserRepository;
import com.ssafy12.moinsoop.skinfit.domain.user.exception.DuplicateUserEmailException;
import com.ssafy12.moinsoop.skinfit.domain.user.exception.InvalidVerificationCodeException;
import com.ssafy12.moinsoop.skinfit.domain.user.exception.VerificationCodeExpiredException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.List;
import java.util.Random;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RedisTemplate redisTemplate;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;
    private final SkinTypeRepository skinTypeRepository;
    private final UserSkinTypeRepository userSkinTypeRepository;

    private static final String EMAIL_VERIFICATION_PREFIX = "email:verification:";
    private static final String EMAIL_VERIFIED_PREFIX = "email:verified:";
    private static final long VERIFICATION_CODE_TTL = 300; // 5분


    public void checkDuplicateUserEmail(String userEmail) {
        // 이메일 중복 체크
        if (userRepository.existsByUserEmail(userEmail)) {
            throw new DuplicateUserEmailException("이미 가입된 메일입니다.");
        }
    }

    public void sendVerificationEmail(String userEmail) {
        // 인증번호 생성
        String verificationCode = generateRandomCode();

        // Redis에 인증 코드 저장
        redisTemplate.opsForValue().set(
                EMAIL_VERIFICATION_PREFIX + userEmail,
                verificationCode,
                Duration.ofSeconds(VERIFICATION_CODE_TTL)
        );

        // 인증 메일 발송
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(userEmail);
        message.setSubject("skinfit 회원가입 이메일 인증");
        message.setText("인증 코드: " + verificationCode + "\n 5분 내로 입력하세요");
        mailSender.send(message);

    }

    public void signUp(SignUpRequest request) {

        String userEmail = request.getUserEmail();
        String userPassword = passwordEncoder.encode(request.getUserPassword());
        String code = request.getCode();

        // 레디스 저장된 인증번호 가져오기,
        String storedCode = (String) redisTemplate.opsForValue().get(EMAIL_VERIFICATION_PREFIX + userEmail);

        // 인증번호 검증
        if (storedCode == null) {
            throw new VerificationCodeExpiredException("5분이 지났습니다. 이메일을 재전송 하세요.");
        }

        if (!storedCode.equals(code)) {
            throw new InvalidVerificationCodeException("잘못된 인증 코드입니다. 인증 코드를 다시 입력하세요");
        }

        // 레디스 저장된 인증번호를 인증했다고 변경
        redisTemplate.opsForValue().set(EMAIL_VERIFIED_PREFIX + userEmail, "verified", Duration.ofHours(24));

        // 기존 인종코드 삭제
        redisTemplate.delete(EMAIL_VERIFICATION_PREFIX + userEmail);


        //임의의 닉네임
        String[] nicknames = userEmail.split("@");
        String nickname = nicknames[0];

        //회원가입
        User user = User.builder()
                .userEmail(userEmail)
                .userPassword(userPassword)
                .nickname(nickname)
                .providerType(ProviderType.LOCAL)
                .roleType(RoleType.USER)
                .isRegistered(false)
                .build();

        userRepository.save(user);
    }

    public void sendTemporaryPassword(String userEmail) {
        // 사용자 존재 여부 확인
        User user = userRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("가입되지 않은 이메일입니다."));

        // 임시 비밀번호 생성
        String temporaryPassword = generateTemporaryPassword();

        // 임시 비밀번호 업데이트
        user.updatePassword(passwordEncoder.encode(temporaryPassword));

        // Redis에 저장된 리프레시 토큰 삭제 (보안)
        redisTemplate.delete("RT:" + user.getUserId());

        // 이메일 발송
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(userEmail);
        message.setSubject("skinfit 임시 비밀번호 발급");
        message.setText("임시 비밀번호: " + temporaryPassword +
                "\n로그인 후 반드시 비밀번호를 변경해주세요.");

        mailSender.send(message);
    }

    public void initializeUserInfo(Integer userId, RegisterUserInfoRequest request) {
        // 1. 사용자 기본 정보 업데이트
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));
        updateUserBasicInfo(user, request);

        // 2. 사용자 피부 타입 정보 저장
        saveUserSkinTypes(user, request.getSkinTypeIds());
    }

    // 인증번호 생성메서드
    private String generateRandomCode() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(1000000));
    }

    // 임시 비밀번호 생성 메서드
    private String generateTemporaryPassword() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
        StringBuilder password = new StringBuilder();
        Random random = new Random();

        for (int i = 0; i < 10; i++) {
            password.append(chars.charAt(random.nextInt(chars.length())));
        }

        return password.toString();
    }


    // 기본 회원정보 최초 등록 메서드
    private void updateUserBasicInfo(User user, RegisterUserInfoRequest request) {
        user.updateInitialInfo(
                request.getNickname(),
                request.getGender(),
                request.getYear()
        );
        user.setRegistered(true);
    }

    // 사용자 피부 타입 정보 저장 메서드
    private void saveUserSkinTypes(User user, List<Integer> skinTypeIds) {
        List<UserSkinType> userSkinTypes = skinTypeIds.stream()
                .map(typeId -> {
                    SkinType skinType = skinTypeRepository.findById(typeId)
                            .orElseThrow(() -> new EntityNotFoundException("SkinType Not found"));
                    return UserSkinType.create(user, skinType);
                })
                .toList();
        userSkinTypeRepository.saveAll(userSkinTypes);
    }
}
