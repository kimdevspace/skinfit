package com.ssafy12.moinsoop.skinfit;

import com.ssafy12.moinsoop.skinfit.domain.user.dto.response.MainPageResponse;
import com.ssafy12.moinsoop.skinfit.domain.user.service.MainPageService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;

import java.util.Arrays;
import java.util.List;


//@SpringBootTestgit
//public class MainPageTest {
//
//    @Autowired
//    private RedisTemplate redisTemplate;
//    @Autowired
//    private MainPageService mainPageService;
//
//    @Test
//    void testMainPage() {
//        //given
//        Integer userId = 1;
//        String key = "recommend:" + userId;
//        List<Integer> recommendedIds = Arrays.asList(1, 2, 3, 4, 5);
//
//        redisTemplate.opsForValue().set(key, recommendedIds);
//
//        //when
//        MainPageResponse response = mainPageService.getMainPage(userId);
//
//        Assertions.assertNotNull(response);
//        Assertions.assertEquals(5, response.getRecommendedCosmetics().size());
//    }
//}
