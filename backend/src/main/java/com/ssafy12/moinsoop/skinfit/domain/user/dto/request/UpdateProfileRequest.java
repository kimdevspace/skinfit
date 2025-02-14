package com.ssafy12.moinsoop.skinfit.domain.user.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UpdateProfileRequest {
    @NotNull
    private String nickname;
    private String newPassword;
    @NotEmpty
    private List<Integer> skinTypeIds;
}
