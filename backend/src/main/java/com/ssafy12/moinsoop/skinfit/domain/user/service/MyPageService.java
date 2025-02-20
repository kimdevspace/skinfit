package com.ssafy12.moinsoop.skinfit.domain.user.service;

import com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.Cosmetic;
import com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.repository.CosmeticRepository;
import com.ssafy12.moinsoop.skinfit.domain.experience.entity.*;
import com.ssafy12.moinsoop.skinfit.domain.experience.entity.repository.CosmeticExperienceRepository;
import com.ssafy12.moinsoop.skinfit.domain.experience.entity.repository.IngredientExperienceRepository;
import com.ssafy12.moinsoop.skinfit.domain.experience.entity.repository.SymptomRepository;
import com.ssafy12.moinsoop.skinfit.domain.ingredient.entity.Ingredient;
import com.ssafy12.moinsoop.skinfit.domain.ingredient.entity.repository.IngredientRepository;
import com.ssafy12.moinsoop.skinfit.domain.review.entity.ReviewLike;
import com.ssafy12.moinsoop.skinfit.domain.review.entity.repository.ReviewLikeRepository;
import com.ssafy12.moinsoop.skinfit.domain.review.entity.repository.ReviewRepository;
import com.ssafy12.moinsoop.skinfit.domain.skintype.entity.SkinType;
import com.ssafy12.moinsoop.skinfit.domain.skintype.entity.UserSkinType;
import com.ssafy12.moinsoop.skinfit.domain.skintype.entity.repository.UserSkinTypeRepository;
import com.ssafy12.moinsoop.skinfit.domain.user.dto.request.CosmeticUpdateRequest;
import com.ssafy12.moinsoop.skinfit.domain.user.dto.request.IngredientUpdateRequest;
import com.ssafy12.moinsoop.skinfit.domain.user.dto.response.*;
import com.ssafy12.moinsoop.skinfit.domain.user.entity.User;
import com.ssafy12.moinsoop.skinfit.domain.user.entity.repository.UserRepository;
import com.ssafy12.moinsoop.skinfit.global.core.analysis.IngredientAnalysisCacheManager;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronizationAdapter;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class MyPageService {

    private final UserRepository userRepository;
    private final UserSkinTypeRepository userSkinTypeRepository;
    private final ReviewRepository reviewRepository;
    private final ReviewLikeRepository reviewLikeRepository;
    private final CosmeticExperienceRepository cosmeticExperienceRepository;
    private final CosmeticRepository cosmeticRepository;
    private final SymptomRepository symptomRepository;
    private final IngredientExperienceRepository ingredientExperienceRepository;
    private final IngredientRepository ingredientRepository;
    private final IngredientAnalysisCacheManager ingredientAnalysisCacheManager;
    private final RedisTemplate redisTemplate;
    private final MainPageService mainPageService;
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

    // top3 .. 다시 구현해야 함.
    /**
     * TODO
     * 1. 이 부분에서 레디스 캐싱을 진행한다.
     * 2. 캐시 히트 시 로직 실행x 캐시 미스 시 로직 실행
     * 3. 레디스에 저장되어 있는걸 다 가져와서 검출 횟수 기준 내림차순하여 최대 3개까지 응답해준다.
     */
    @Transactional(readOnly = true)
    public Top3BadIngredientsResponse getTop3BadIngredients(Integer userId) {
        User user = userRepository.findById(userId)
                        .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다"));

        // 캐싱
        ingredientAnalysisCacheManager.initializeUserCache(userId);

        // 레디스에서 가져오기
        String key = "ingredient:analysis:" + userId;
        Object value = redisTemplate.opsForValue().get(key);

        if (value instanceof Map) {
            Map<String, Integer> detectionMap = (Map<String, Integer>) value;

            // 정렬된 Entry 리스트를 유지
            List<Map.Entry<String, Integer>> sortedEntries = detectionMap.entrySet()
                    .stream()
                    .sorted((e1, e2) -> e2.getValue().compareTo(e1.getValue()))
                    .limit(3)
                    .toList();

            // ID 리스트 생성
            List<Integer> top3IngredientIds = sortedEntries.stream()
                    .map(entry -> Integer.parseInt(entry.getKey()))
                    .toList();

            // 데이터베이스에서 조회한 결과를 원래 순서대로 재정렬
            Map<Integer, Ingredient> ingredientMap = ingredientRepository.findByIngredientIdIn(top3IngredientIds)
                    .stream()
                    .collect(Collectors.toMap(
                            Ingredient::getIngredientId,
                            ingredient -> ingredient
                    ));

            // 원래 순서대로 이름 리스트 생성
            List<String> ingredientNames = top3IngredientIds.stream()
                    .map(id -> ingredientMap.get(id).getIngredientName())
                    .collect(Collectors.toList());

            return Top3BadIngredientsResponse.builder()
                    .ingredientNames(ingredientNames)
                    .build();
        }

        // 데이터가 없는 경우 빈 리스트 반환
        return Top3BadIngredientsResponse.builder()
                .ingredientNames(Collections.emptyList())
                .build();
    }

    // 모든 안맞는 성분 자세히 보기, 성분명과 검출횟수
    public AllBadIngredientsResponse getAllBadIngredients(Integer userId) {
        String key = "ingredient:analysis:" + userId;
        Object value = redisTemplate.opsForValue().get(key);

        if (value instanceof Map) {
            Map<String, Integer> detectionMap = (Map<String, Integer>) value;

            // 검출 횟수로 정렬된 Entry 리스트 생성 (이번에는 limit 없이)
            List<Map.Entry<String, Integer>> sortedEntries = detectionMap.entrySet()
                    .stream()
                    .sorted((e1, e2) -> e2.getValue().compareTo(e1.getValue()))
                    .collect(Collectors.toList());

            // ID 리스트 생성
            List<Integer> ingredientIds = sortedEntries.stream()
                    .map(entry -> Integer.parseInt(entry.getKey()))
                    .collect(Collectors.toList());

            // 데이터베이스에서 조회한 결과를 Map으로 변환
            Map<Integer, Ingredient> ingredientMap = ingredientRepository.findByIngredientIdIn(ingredientIds)
                    .stream()
                    .collect(Collectors.toMap(
                            Ingredient::getIngredientId,
                            ingredient -> ingredient
                    ));

            // 원래 순서대로 BadIngredientInfo 리스트 생성
            List<AllBadIngredientsResponse.BadIngredientInfo> badIngredients = sortedEntries.stream()
                    .map(entry -> {
                        Integer id = Integer.parseInt(entry.getKey());
                        return AllBadIngredientsResponse.BadIngredientInfo.builder()
                                .ingredientName(ingredientMap.get(id).getIngredientName())
                                .ewgScoreMin(ingredientMap.get(id).getEwgScoreMin())
                                .ewgScoreMax(ingredientMap.get(id).getEwgScoreMax())
                                .detectionCount(entry.getValue())
                                .build();
                    })
                    .collect(Collectors.toList());

            return AllBadIngredientsResponse.builder()
                    .ingredients(badIngredients)
                    .build();
        }

        return AllBadIngredientsResponse.builder()
                .ingredients(Collections.emptyList())
                .build();
    }

    // 내가 등록한 화장품, 맞는 것과 안맞는 것으로 구분하여 응답
    @Transactional(readOnly = true)
    public MyCosmeticsResponse getAllMyCosmetics(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다"));

        List<CosmeticExperience> experiences = cosmeticExperienceRepository.findByUserId(userId);

        List<MyCosmeticsResponse.CosmeticExperienceDto> suitableList = experiences.stream()
                .filter(CosmeticExperience::isSuitable)
                .map(this::convertToDtoCosmetic)
                .toList();

        List<MyCosmeticsResponse.CosmeticExperienceDto> unsuitalbeList = experiences.stream()
                .filter(exp -> !exp.isSuitable())
                .map(this::convertToDtoCosmetic)
                .toList();

        return MyCosmeticsResponse.builder()
                .suitableCosmetics(suitableList)
                .unsuitableCosmetics(unsuitalbeList)
                .build();
    }

    // 내가 등록한 성분, 맞는 것과 안 맞는 것으로 구분하여 응답
    public MyIngredientsResponse getAllMyIngredients(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));


        List<IngredientExperience> experiences =
                ingredientExperienceRepository.findByUserUserId(userId);

        List<MyIngredientsResponse.IngredientExperienceDto> suitableIngredients = experiences.stream()
                .filter(IngredientExperience::isSuitable)
                .map(this::convertToDtoIngredient)
                .toList();

        List<MyIngredientsResponse.IngredientExperienceDto> unsuitableIngredients = experiences.stream()
                .filter(experience -> !experience.isSuitable())
                .map(this::convertToDtoIngredient)
                .toList();

        return MyIngredientsResponse.builder()
                .suitableIngredients(suitableIngredients)
                .unsuitableIngredients(unsuitableIngredients)
                .build();
    }


    @Transactional(readOnly = true)
    public MyReviewResponse getAllMyReviews(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));

        List<MyReviewResponse.ReviewDto> myReviews = reviewRepository.findByUser_UserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(MyReviewResponse.ReviewDto::from)
                .toList();

        List<MyReviewResponse.ReviewDto> likedReviews = reviewLikeRepository.findByUser_UserId(userId)
                .stream()
                .map(ReviewLike::getReview)
                .map(MyReviewResponse.ReviewDto::from)
                .toList();

        return MyReviewResponse.builder()
                .myReviews(myReviews)
                .likedReviews(likedReviews)
                .build();
    }

    /**
     * 나와 맞는 화장품을 수정하는 폼으로 이동하는 메서드
     * GET 요청이기 떄문에 사용자가 등록한 맞는 화장품을 응답해주어야 한다.
     */
    @Transactional(readOnly = true)
    // 잘 맞는 화장품 목록 조회
    public List<CosmeticExperienceDto> getAllSuitableCosmetics(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자 정보를 찾을 수 없습니다"));

        List<CosmeticExperience> experiences =
                cosmeticExperienceRepository.findByUser_UserIdAndIsSuitableTrue(userId);

        return experiences.stream()
                .map(this::convertToDtoAtUpdateCosmetic)
                .toList();
    }

    // 잘 맞는 화장품 목록 수정
    @Transactional
    public void updateSuitableCosmetics(Integer userId, List<CosmeticUpdateRequest> requests) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자 정보를 찾을 수 없습니다"));

        updateCosmeticExperiences(user, requests, true);
    }

    // 안맞는 화장품 목록 조회
    @Transactional(readOnly = true)
    public List<CosmeticExperienceDto> getAllUnsuitableCosmetics(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자 정보를 찾을 수 없습니다"));

        List<CosmeticExperience> experiences =
                cosmeticExperienceRepository.findByUser_UserIdAndIsSuitableFalse(userId);

        return experiences.stream()
                .map(this::convertToDtoAtUpdateCosmetic)
                .toList();
    }

    // 나에게 맞지 않는 화장품 수정 메서드
    @Transactional
    public void updateUnsuitableCosmetics(Integer userId, List<CosmeticUpdateRequest> requests) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자 정보를 찾을 수 없습니다"));

        updateCosmeticExperiences(user, requests, false);
    }

    // 잘 맞는 성분 목록 조회
    @Transactional(readOnly = true)
    public List<IngredientExperienceDto> getAllSuitableIngredients(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자 정보를 찾을 수 없습니다"));

        List<IngredientExperience> experiences =
                ingredientExperienceRepository.findByUser_UserIdAndIsSuitableTrue(userId);

        return experiences.stream()
                .map(this::convertToDtoAtUpdateIngredient)
                .toList();
    }

    // 잘 맞는 성분 목록 수정
    @Transactional
    public void updateSuitableIngredients(Integer userId, List<IngredientUpdateRequest> requests) {
        updateIngredientExperiences(userId, requests, true);
    }

    // 안 맞는 성분 조회
    @Transactional(readOnly = true)
    public List<IngredientExperienceDto> getAllUnsuitableIngredients(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자 정보를 찾을 수 없습니다"));

        List<IngredientExperience> experiences = ingredientExperienceRepository.findByUser_UserIdAndIsSuitableFalse(userId);

        return experiences.stream()
                .map(this::convertToDtoAtUpdateIngredient)
                .toList();
    }

    // 안 맞는 성분 수정
    // 안맞는 성분 목록 수정
    @Transactional
    public void updateUnsuitableIngredients(Integer userId, List<IngredientUpdateRequest> requests) {
        updateIngredientExperiences(userId, requests, false);
    }


    private MyCosmeticsResponse.CosmeticExperienceDto convertToDtoCosmetic(CosmeticExperience experience) {
        return MyCosmeticsResponse.CosmeticExperienceDto.builder()
                .cosmeticId(experience.getCosmetic().getCosmeticId())
                .cosmeticBrand(experience.getCosmetic().getCosmeticBrand())
                .cosmeticName(experience.getCosmetic().getCosmeticName())
                .cosmeticVolume(experience.getCosmetic().getCosmeticVolume())
                .imageUrl(experience.getCosmetic().getImageUrl())
                .build();
    }

    // 성분 DTO 변환
    private MyIngredientsResponse.IngredientExperienceDto convertToDtoIngredient(IngredientExperience experience) {
        return MyIngredientsResponse.IngredientExperienceDto.builder()
                .ingredientId(experience.getIngredient().getIngredientId())
                .ingredientName(experience.getIngredient().getIngredientName())
                .ewgScoreMin(experience.getIngredient().getEwgScoreMin())
                .ewgScoreMax(experience.getIngredient().getEwgScoreMax())
                .build();
    }


    // 업데이트 화장품 DTO 변환
    private CosmeticExperienceDto convertToDtoAtUpdateCosmetic(CosmeticExperience experience) {
        List<CosmeticExperienceDto.SymptomDto> symptoms =
                experience.isSuitable() ? new ArrayList<>() : // 잘 맞는 화장품이면 빈 리스트
                        experience.getCosmeticSymptoms().stream()
                                .map(cosmeticSymptom -> CosmeticExperienceDto.SymptomDto.builder()
                                        .symptomId(cosmeticSymptom.getSymptom().getSymptomId())
                                        .symptomName(cosmeticSymptom.getSymptom().getName())
                                        .build())
                                .toList();

        return CosmeticExperienceDto.builder()
                .cosmeticId(experience.getCosmetic().getCosmeticId())
                .cosmeticBrand(experience.getCosmetic().getCosmeticBrand())
                .cosmeticName(experience.getCosmetic().getCosmeticName())
                .cosmeticVolume(experience.getCosmetic().getCosmeticVolume())
                .imageUrl(experience.getCosmetic().getImageUrl())
                .symptoms(symptoms)
                .build();
    }

    // 화장품 경험 업데이트 공통 메서드
    private void updateCosmeticExperiences(User user, List<CosmeticUpdateRequest> requests, boolean isSuitable) {
        // 1. 기존 화장품 경험 목록 조회
        List<CosmeticExperience> existingExperiences = isSuitable ?
                cosmeticExperienceRepository.findByUser_UserIdAndIsSuitableTrue(user.getUserId()) :
                cosmeticExperienceRepository.findByUser_UserIdAndIsSuitableFalse(user.getUserId());

        // 2. 요청된 화장품 ID 목록
        List<Integer> newCosmeticIds = requests.stream()
                .map(CosmeticUpdateRequest::getCosmeticId)
                .toList();

        // 3. 삭제할 경험 찾기
        List<CosmeticExperience> experiencesToDelete = existingExperiences.stream()
                .filter(exp -> !newCosmeticIds.contains(exp.getCosmetic().getCosmeticId()))
                .toList();

        // 4. 새로 추가할 경험 생성
        List<Integer> existingIds = existingExperiences.stream()
                .map(exp -> exp.getCosmetic().getCosmeticId())
                .toList();

        List<CosmeticExperience> experiencesToAdd = requests.stream()
                .filter(request -> !existingIds.contains(request.getCosmeticId()))
                .map(request -> {
                    Cosmetic cosmetic = cosmeticRepository.findById(request.getCosmeticId())
                            .orElseThrow(() -> new EntityNotFoundException("화장품을 찾을 수 없습니다: " + request.getCosmeticId()));

                    CosmeticExperience experience = CosmeticExperience.builder()
                            .user(user)
                            .cosmetic(cosmetic)
                            .isSuitable(isSuitable)
                            .build();

                    // 안맞는 화장품일 경우 증상 추가
                    if (!isSuitable && request.getSymptomIds() != null && !request.getSymptomIds().isEmpty()) {
                        List<Symptom> symptoms = symptomRepository.findAllById(request.getSymptomIds());
                        symptoms.forEach(symptom -> {
                            CosmeticSymptom cosmeticSymptom = CosmeticSymptom.builder()
                                    .cosmeticExperience(experience)
                                    .symptom(symptom)
                                    .build();
                            experience.addSymptom(cosmeticSymptom);
                        });
                    }

                    return experience;
                })
                .toList();

        // 5. 변경사항 적용
        cosmeticExperienceRepository.deleteAll(experiencesToDelete);
        cosmeticExperienceRepository.saveAll(experiencesToAdd);

        // 6. 추천알고리즘 다시 실행
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronizationAdapter() {
            @Override
            public void afterCommit() {
                refreshRecommendations(user.getUserId());
            }
        });
    }

    // 업데이트 성분 DTO 변환
    private IngredientExperienceDto convertToDtoAtUpdateIngredient(IngredientExperience experience) {
        List<IngredientExperienceDto.SymptomDto> symptoms =
                experience.isSuitable() ? new ArrayList<>() :
                        experience.getIngredientSymptoms().stream()
                                .map(symptom -> IngredientExperienceDto.SymptomDto.builder()
                                        .symptomId(symptom.getSymptom().getSymptomId())
                                        .symptomName(symptom.getSymptom().getName())
                                        .build())
                                .toList();

        return IngredientExperienceDto.builder()
                .ingredientId(experience.getIngredient().getIngredientId())
                .ingredientName(experience.getIngredient().getIngredientName())
                .symptoms(symptoms)
                .build();
    }

    public void updateIngredientExperiences(Integer userId, List<IngredientUpdateRequest> requests, boolean isSuitable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자 정보를 찾을 수 없습니다"));

        // 1. 기존 성분 경험 목록 조회
        List<IngredientExperience> existingExperiences = isSuitable ?
                ingredientExperienceRepository.findByUser_UserIdAndIsSuitableTrue(userId) :
                ingredientExperienceRepository.findByUser_UserIdAndIsSuitableFalse(userId);

        // 2. 요청된 성분 ID 목록
        List<Integer> newIngredientIds = requests.stream()
                .map(IngredientUpdateRequest::getIngredientId)
                .toList();

        // 3. 삭제할 경험 찾기
        List<IngredientExperience> experiencesToDelete = existingExperiences.stream()
                .filter(exp -> !newIngredientIds.contains(exp.getIngredient().getIngredientId()))
                .toList();

        // 4. 새로 추가할 경험 생성
        List<Integer> existingIds = existingExperiences.stream()
                .map(exp -> exp.getIngredient().getIngredientId())
                .toList();

        List<IngredientExperience> experiencesToAdd = requests.stream()
                .filter(request -> !existingIds.contains(request.getIngredientId()))
                .map(request -> {
                    Ingredient ingredient = ingredientRepository.findById(request.getIngredientId())
                            .orElseThrow(() -> new EntityNotFoundException("성분을 찾을 수 없습니다: " + request.getIngredientId()));

                    IngredientExperience experience = IngredientExperience.builder()
                            .user(user)
                            .ingredient(ingredient)
                            .isSuitable(isSuitable)
                            .build();

                    // 안맞는 성분일 경우 증상 추가
                    if (!isSuitable && request.getSymptomIds() != null && !request.getSymptomIds().isEmpty()) {
                        request.getSymptomIds().forEach(symptomId -> {
                            Symptom symptom = symptomRepository.findById(symptomId)
                                    .orElseThrow(() -> new EntityNotFoundException("증상을 찾을 수 없습니다: " + symptomId));

                            IngredientSymptom ingredientSymptom = IngredientSymptom.builder()
                                    .ingredientExperience(experience)
                                    .symptom(symptom)
                                    .build();

                            experience.getIngredientSymptoms().add(ingredientSymptom);
                        });
                    }

                    return experience;
                })
                .toList();

        // 5. 변경사항 적용
        ingredientExperienceRepository.deleteAll(experiencesToDelete);
        ingredientExperienceRepository.saveAll(experiencesToAdd);

        // 6. 추천 알고리즘 다시 적용
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronizationAdapter() {
            @Override
            public void afterCommit() {
                refreshRecommendations(user.getUserId());
            }
        });
    }

    private void refreshRecommendations(Integer userId) {
        String cacheKey = "recommend" + userId;

        if (redisTemplate.hasKey(cacheKey)) {
            redisTemplate.delete(cacheKey);
        }

        CompletableFuture.runAsync(() -> {
            try {
                mainPageService.callFastAPIForRecommendation(userId);
            } catch (Exception e) {
                log.error("Failed to refresh recommendations for user: " + userId, e);
            }
        });

    }
}
