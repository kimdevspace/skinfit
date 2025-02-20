package com.ssafy12.moinsoop.skinfit.domain.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class LoginRequest {
    @NotBlank
    @Email
    private String userEmail;

    @NotBlank
    private String userPassword;
}