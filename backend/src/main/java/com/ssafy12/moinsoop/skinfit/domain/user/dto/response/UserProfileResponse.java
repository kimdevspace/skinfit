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
    private List<SkinTypeInfo> skinTypes;  // 모든 피부타입 정보를 담되, isSelected로 현재 선택여부 표시

    @Getter
    @Builder
    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    public static class SkinTypeInfo {
        private Integer typeId;
        private String typeName;
        private boolean isSelected;

        public static SkinTypeInfo of(SkinType skinType, boolean isSelected) {
            return SkinTypeInfo.builder()
                    .typeId(skinType.getTypeId())
                    .typeName(skinType.getTypeName())
                    .isSelected(isSelected)
                    .build();
        }
    }
}