package com.ssafy12.moinsoop.skinfit.domain.admin.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class AdminReviewException extends RuntimeException {
    public AdminReviewException(String message) {
        super(message);
    }
}
