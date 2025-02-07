package com.ssafy12.moinsoop.skinfit.domain.user.service;

import com.ssafy12.moinsoop.skinfit.domain.experience.entity.repository.IngredientExperienceRepository;
import com.ssafy12.moinsoop.skinfit.domain.ingredient.entity.Ingredient;
import com.ssafy12.moinsoop.skinfit.domain.skintype.entity.SkinType;
import com.ssafy12.moinsoop.skinfit.domain.skintype.entity.UserSkinType;
import com.ssafy12.moinsoop.skinfit.domain.skintype.entity.repository.UserSkinTypeRepository;
import com.ssafy12.moinsoop.skinfit.domain.user.dto.response.Top3UnSuitIngredientsResponse;
import com.ssafy12.moinsoop.skinfit.domain.user.dto.response.UnSuitIngredientDto;
import com.ssafy12.moinsoop.skinfit.domain.user.dto.response.UserNicknameAndUserSkinTypeResponse;
import com.ssafy12.moinsoop.skinfit.domain.user.entity.User;
import com.ssafy12.moinsoop.skinfit.domain.user.entity.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class MyPageService {

    private final UserRepository userRepository;
    private final UserSkinTypeRepository userSkinTypeRepository;
    private final IngredientExperienceRepository ingredientExperienceRepository;

    @Transactional(readOnly = true)
    public UserNicknameAndUserSkinTypeResponse getUserNicknameAndSkinTypes(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다"));

        // 사용자의 스킨 타입들
        List<String> userSkinTypes = userSkinTypeRepository.findAllByUser_UserId(userId)
                .stream()
                .map(UserSkinType::getSkinType)
                .map(SkinType::getTypeName)
                .toList();

        // 응답 객체 반환
        return new UserNicknameAndUserSkinTypeResponse(user.getNickname(), userSkinTypes);
    }

    @Transactional(readOnly = true)
    public Top3UnSuitIngredientsResponse getTop3UnSuitIngredients(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다"));

        Pageable topThree = PageRequest.of(0, 3);
        List<Object[]> results = ingredientExperienceRepository.findTop3UnSuitableIngredientsWithCount(userId, topThree);

        List<UnSuitIngredientDto> ingredients = results.stream()
                .map(result -> new UnSuitIngredientDto(
                        (String) result[0],
                        ((Long) result[1]).intValue()
                ))
                .toList();

        return new Top3UnSuitIngredientsResponse(ingredients);
    }
}
