package com.ssafy12.moinsoop.skinfit.domain.user.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class EmailVerificationRequest {
    private String userEmail;
    private String code;
}
