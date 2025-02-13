package com.ssafy12.moinsoop.skinfit.domain.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserNicknameAndUserSkinTypeResponse {
    private String nickname;
    private List<String> userSkinTypes;
}
