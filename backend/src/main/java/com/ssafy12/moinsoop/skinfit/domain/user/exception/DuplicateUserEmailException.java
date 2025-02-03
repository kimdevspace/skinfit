package com.ssafy12.moinsoop.skinfit.domain.user.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateUserEmailException extends RuntimeException{

    public DuplicateUserEmailException(String message) {
        super(message);
    }
}
