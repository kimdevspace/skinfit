package com.ssafy12.moinsoop.skinfit.global.core.analysis;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Component
@RequiredArgsConstructor
public class IngredientAnalysisCacheManager {

    private final RedisTemplate<String, Object> redisTemplate;
    private final IngredientAnalysisService ingredientAnalysisService;
    private static final String CACHE_KEY_PREFIX = "ingredient:analysis:";
    private static final Duration CACHE_TTL = Duration.ofHours(24);

    /**
     * 사용자의 성분 분석 결과를 캐시에서 조회
     */
    public Map<Integer, Integer> getCachedAnalysis(Integer userId) {
        String cacheKey = generateCacheKey(userId);
        return (Map<Integer, Integer>) redisTemplate.opsForValue().get(cacheKey);
    }

    /**
     * 로그인 시 사용자의 캐시를 초기화 (비동기)
     */
    @Async
    public CompletableFuture<Void> initializeUserCache(Integer userId) {
        return CompletableFuture.runAsync(() -> {
            try {
                String cacheKey = generateCacheKey(userId);

                boolean needsRefresh = false;

                // 1. 캐시 존재 여부 확인
                if (Boolean.TRUE.equals(redisTemplate.hasKey(cacheKey))) {
                    Map<Integer, Integer> cachedValue = getCachedAnalysis(userId);

                    // 2. 캐시가 있다면 실제 값과 비교
                    if (cachedValue == null || cachedValue.isEmpty()) {
                        needsRefresh = true;
                        log.info("Cache exists but empty for user: {}", userId);
                    } else {
                        // 3. 실제 계산값과 비교
                        Map<Integer, Integer> currentValue = ingredientAnalysisService.analyzeIngredientsForUser(userId);
                        if (!cachedValue.equals(currentValue)) {
                            needsRefresh = true;
                            log.info("Cache value outdated for user: {}", userId);
                        }
                    }
                } else {
                    needsRefresh = true;
                    log.info("No cache exists for user: {}", userId);
                }

                // 4. 필요한 경우에만 캐시 갱신
                if (needsRefresh) {
                    refreshUserCache(userId);
                }

            } catch (Exception e) {
                log.error("Failed to initialize cache for user: " + userId, e);
                throw e;
            }
        });
    }

    /**
     * 사용자의 캐시를 갱신
     */
    public void refreshUserCache(Integer userId) {
        String cacheKey = generateCacheKey(userId);
        Map<Integer, Integer> analysisResults = ingredientAnalysisService.analyzeIngredientsForUser(userId);
        redisTemplate.opsForValue().set(cacheKey, analysisResults, CACHE_TTL);
    }

    /**
     * 사용자의 캐시를 삭제
     */
    public void invalidateUserCache(Integer userId) {
        String cacheKey = generateCacheKey(userId);
        redisTemplate.delete(cacheKey);
    }

    // 화장품 경험 변경 시
    public void validateOnCosmeticExperienceChange(Integer userId) {
        initializeUserCache(userId);
    }

    // 성분 경험 변경 시
    public void validateOnIngredientExperienceChange(Integer userId) {
        initializeUserCache(userId);
    }

    private String generateCacheKey(Integer userId) {
        return CACHE_KEY_PREFIX + userId;
    }
}