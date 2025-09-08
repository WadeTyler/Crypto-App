package net.tylerwade.cryptoapp.common.exception;

import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

public record ErrorResponse(
        String error,
        String message,
        int status,
        String timestamp
) {

    public static ErrorResponse from(HttpRequestException ex) {
        return new ErrorResponse(
                ex.getHttpStatus().getReasonPhrase(),
                ex.getMessage(),
                ex.getHttpStatus().value(),
                LocalDateTime.now().toString()
        );
    }

    public static ErrorResponse from(Exception ex, HttpStatus status) {
        return new ErrorResponse(
                status.getReasonPhrase(),
                ex.getMessage(),
                status.value(),
                LocalDateTime.now().toString()
        );
    }
}