package com.ssafy12.moinsoop.skinfit.domain.user.service;

import com.ssafy12.moinsoop.skinfit.domain.user.entity.repository.UserRepository;
import com.ssafy12.moinsoop.skinfit.domain.user.exception.DuplicateUserEmailException;
import com.ssafy12.moinsoop.skinfit.domain.user.exception.InvalidVerificationCodeException;
import com.ssafy12.moinsoop.skinfit.domain.user.exception.VerificationCodeExpiredException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.Random;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RedisTemplate redisTemplate;
    private final JavaMailSender mailSender;

    private static final String EMAIL_VERIFICATION_PREFIX = "email:verification:";
    private static final String EMAIL_VERIFIED_PREFIX = "email:verified:";
    private static final long VERIFICATION_CODE_TTL = 300; // 5분

    public void sendVerificationEmail(String userEmail) {
        // 이미 가입된 이메일인지 확인
        if (userRepository.existsByUserEmail(userEmail)) {
            throw new DuplicateUserEmailException("이미 등록된 이메일입니다.");
        }

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

    public void verifyUserEmail(String userEmail, String code) {
        String storedCode = (String) redisTemplate
                .opsForValue()
                .get(EMAIL_VERIFICATION_PREFIX + userEmail);

        if (storedCode == null) {
            throw new VerificationCodeExpiredException("5분이 지났습니다. 이메일을 재전송 하세요.");
        }

        if (!storedCode.equals(code)) {
            throw new InvalidVerificationCodeException("잘못된 인증 코드입니다.");
        }

        redisTemplate.opsForValue().set(
                EMAIL_VERIFIED_PREFIX + userEmail,
                "verified",
                Duration.ofHours(24)
        );

        // 기존 인증 코드 삭제
        redisTemplate.delete(EMAIL_VERIFICATION_PREFIX + userEmail);
    }


    // 인증번호 생성메서드
    private String generateRandomCode() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(1000000));
    }
}
