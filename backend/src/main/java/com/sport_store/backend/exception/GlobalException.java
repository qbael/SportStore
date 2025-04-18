package com.sport_store.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalException extends RuntimeException {
  @ExceptionHandler(Exception.class)
  public ResponseEntity<Object> handleAllExceptions(Exception ex, WebRequest request) {
    StackTraceElement element = ex.getStackTrace()[0]; // Lấy phần tử đầu tiên trong stack trace

    Map<String, Object> body = new LinkedHashMap<>();
    body.put("timestamp", LocalDateTime.now());
    body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
    body.put("error", "Internal Server Error");
    body.put("message", ex.getMessage());
    body.put("class", element.getClassName());
    body.put("method", element.getMethodName());
    body.put("line", element.getLineNumber());
    body.put("path", request.getDescription(false).replace("uri=", ""));

    return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<Object> handleResourceNotFound(ResourceNotFoundException ex, WebRequest request) {
    StackTraceElement element = ex.getStackTrace()[0];

    Map<String, Object> body = new LinkedHashMap<>();
    body.put("timestamp", LocalDateTime.now());
    body.put("status", HttpStatus.NOT_FOUND.value());
    body.put("error", "Not Found");
    body.put("message", ex.getMessage());
    body.put("class", element.getClassName());
    body.put("method", element.getMethodName());
    body.put("line", element.getLineNumber());
    body.put("path", request.getDescription(false).replace("uri=", ""));

    return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
  }
}
