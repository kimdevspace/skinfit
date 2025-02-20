package com.ssafy12.moinsoop.skinfit.domain.user.dto.response;

import com.ssafy12.moinsoop.skinfit.domain.skintype.entity.SkinType;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class UserProfileResponse {
    private String nickname;
    private List<Integer> skinTypeIds;  // 모든 피부타입 정보를 담되, isSelected로 현재 선택여부 표시
}