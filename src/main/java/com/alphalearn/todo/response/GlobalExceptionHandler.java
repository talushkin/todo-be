// 17-09 updated: Map unique constraint violations to 409 Conflict with clear messages
package com.alphalearn.todo.response;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Object> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        String rootMsg = ex.getMostSpecificCause() != null ? ex.getMostSpecificCause().getMessage() : ex.getMessage();
        String message = "Duplicate value";

        // Heuristics based on constraint/index names typical in Postgres/Supabase
        if (rootMsg != null) {
            String lower = rootMsg.toLowerCase();
            if (lower.contains("username") && (lower.contains("unique") || lower.contains("duplicate") || lower.contains("exists"))) {
                message = "Username already exists";
            } else if (lower.contains("email") && (lower.contains("unique") || lower.contains("duplicate") || lower.contains("exists"))) {
                message = "Email already exists";
            }
        }

        return ResponseHandler.buildResponse(false, HttpStatus.CONFLICT, null, message);
    }
}
