package com.ssafy12.moinsoop.skinfit.domain.user.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class VerificationCodeExpiredException extends RuntimeException {
    public VerificationCodeExpiredException(String message) {
        super(message);
    }

    public VerificationCodeExpiredException(String message, Throwable cause) {
        super(message, cause);
    }
}
