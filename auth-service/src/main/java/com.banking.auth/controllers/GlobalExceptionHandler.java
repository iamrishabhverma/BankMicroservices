package com.banking.auth.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        log.error("Request failed: {}", ex.getMessage(), ex);

        String message = ex.getMessage() != null ? ex.getMessage() : "Something went wrong";

        HttpStatus status = HttpStatus.BAD_REQUEST;
        if (message.toLowerCase().contains("invalid username or password")) {
            status = HttpStatus.UNAUTHORIZED;
        } else if (message.toLowerCase().contains("already exists")) {
            status = HttpStatus.CONFLICT;
        }

        return ResponseEntity.status(status).body(Map.of("message", message));
    }
}