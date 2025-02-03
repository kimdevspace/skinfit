package com.ssafy12.moinsoop.skinfit.global.config;

import com.ssafy12.moinsoop.skinfit.global.security.JwtProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    private final RedisTemplate<String, String> redisTemplate;
    private final JwtProperties jwtProperties;

    public void saveRefreshToken(Integer userId, String refreshToken) {
        ValueOperations<String, String> values = redisTemplate.opsForValue();
        values.set(
                "RT:" + userId,
                refreshToken,
                jwtProperties.getRefreshTokenExpiration(),
                TimeUnit.MILLISECONDS
        );
    }

    public String getRefreshToken(Integer userId) {
        ValueOperations<String, String> values = redisTemplate.opsForValue();
        return values.get("RT:" + userId);
    }

    public void deleteRefreshToken(Integer userId) {
        redisTemplate.delete("RT:" + userId);
    }
}
