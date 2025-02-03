package com.ssafy12.moinsoop.skinfit.domain.auth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class SignInResponse {
    private String accessToken;
    private boolean isRegistered;
}
