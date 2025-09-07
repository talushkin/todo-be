package com.alphalearn.todo.response;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

/**
 * Author: Karthik
 * Date: 6/13/2023
 * Time: 8:03 AM
 */
public class ResponseHandler {

    public static ResponseEntity<Object> buildResponse(
            Boolean isSuccessful,
            HttpStatus httpStatus,
            Object responseObject,
            String error
    ) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", isSuccessful);
        response.put("statusCode", httpStatus.value());
        response.put("data", responseObject);
        response.put("error", error);
        return new ResponseEntity<>(response, httpStatus);
    }

}
