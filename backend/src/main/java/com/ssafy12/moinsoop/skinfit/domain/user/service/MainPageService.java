package com.ssafy12.moinsoop.skinfit.domain.user.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.repository.CosmeticRepository;
import com.ssafy12.moinsoop.skinfit.domain.experience.entity.repository.CosmeticExperienceRepository;
import com.ssafy12.moinsoop.skinfit.domain.user.dto.response.MainPageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class MainPageService {
    private final RedisTemplate<String, Object> redisTemplate;
    private final CosmeticRepository cosmeticRepository;
    private final CosmeticExperienceRepository cosmeticExperienceRepository;
    private final RestTemplate restTemplate;

    @Transactional(readOnly = true)
    public MainPageResponse getMainPage(Integer userId) {
        // 1. 사용자의 화장품 통계 조회
        int goodCount = cosmeticExperienceRepository.countByUser_UserIdAndIsSuitableTrue(userId);
        int badCount = cosmeticExperienceRepository.countByUser_UserIdAndIsSuitableFalse(userId);

        // 2. 레벨 계산
        int totalCosmetics = goodCount + badCount;
        int level = calculateLevel(totalCosmetics);

        // 3. 추천 화장품 조회
        String redisKey = "recommend:" + userId;
        Object cachedValue = redisTemplate.opsForValue().get(redisKey);

        List<MainPageResponse.RecommendedCosmeticInfo> recommendedCosmetics;
        if (cachedValue == null) {
            // Cache miss: FastAPI 호출
            callFastAPIForRecommendation(userId);
            cachedValue = redisTemplate.opsForValue().get(redisKey);

            if (cachedValue == null) {
                throw new RuntimeException("Failed to get recommendation data");
            }
        }

        // 4. 추천 화장품 정보 조회
        List<Integer> recommendedIds = parseRedisValue(cachedValue);
        recommendedCosmetics = getRecommendedCosmeticsInfo(recommendedIds);

        return MainPageResponse.builder()
                .level(level)
                .goodCosmeticsCount(goodCount)
                .badCosmeticsCount(badCount)
                .recommendedCosmetics(recommendedCosmetics)
                .build();
    }


    private int calculateLevel(int totalCosmetics) {
        if (totalCosmetics >= 11) return 3;
        if (totalCosmetics >= 6) return 2;
        if (totalCosmetics >= 2) return 1;
        return 0;
    }

    private List<MainPageResponse.RecommendedCosmeticInfo> getRecommendedCosmeticsInfo(List<Integer> cosmeticIds) {    // Long → Integer
        return cosmeticRepository.findAllById(cosmeticIds)
                .stream()
                .map(cosmetic -> MainPageResponse.RecommendedCosmeticInfo.builder()
                        .cosmeticId(cosmetic.getCosmeticId())  // 더 이상 Long 변환이 필요 없음
                        .cosmeticName(cosmetic.getCosmeticName())
                        .brandName(cosmetic.getCosmeticBrand())
                        .imageUrl(cosmetic.getImageUrl())
                        .build())
                .toList();
    }

    public void callFastAPIForRecommendation(Integer userId) {
        try {
            // 요청 본문 생성
            Map<String, Integer> requestBody = new HashMap<>();
            requestBody.put("userId", userId);

            // FastAPI 호출
            restTemplate.postForObject(
                    "https://i12b111.p.ssafy.io/recommend/recommend_cosmetics",  // URL
                    requestBody,                        // 요청 본문
                    Void.class                         // 응답 타입 (응답은 무시)
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to call recommendation service", e);
        }
    }

    private List<Integer> parseRedisValue(Object value) {    // Long → Integer
        if (value instanceof List) {
            return (List<Integer>) value;
        } else if (value instanceof String) {
            ObjectMapper mapper = new ObjectMapper();
            try {
                return mapper.readValue((String) value, new TypeReference<List<Integer>>() {});
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Failed to parse Redis value", e);
            }
        }
        throw new RuntimeException("Unexpected Redis value type");
    }
}
