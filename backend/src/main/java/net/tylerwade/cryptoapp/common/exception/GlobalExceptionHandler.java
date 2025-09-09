package net.tylerwade.cryptoapp.common.exception;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.tylerwade.cryptoapp.config.CryptoAppProperties;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {
    private final CryptoAppProperties cryptoAppProperties;

    @ExceptionHandler(HttpRequestException.class)
    public ResponseEntity<ErrorResponse> handleHttpRequestException(HttpRequestException ex) {
        log(ex);
        return ResponseEntity.status(ex.getHttpStatus()).body(ErrorResponse.from(ex));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidationException(MethodArgumentNotValidException ex) {
        StringBuilder errorMessage = new StringBuilder();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errorMessage.append(error.getField()).append(" ").append(error.getDefaultMessage()).append("; ")
        );

        return new ErrorResponse(
                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                errorMessage.toString(),
                HttpStatus.BAD_REQUEST.value(),
                LocalDateTime.now().toString()
        );
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleMissingParams(MissingServletRequestParameterException ex) {
        log(ex);
        return ErrorResponse.from(ex, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        log(ex);
        return new ErrorResponse(
                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                "Malformed JSON request.",
                HttpStatus.BAD_REQUEST.value(),
                LocalDateTime.now().toString()
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> catchAll(Exception ex) {
        log(ex);
        return ResponseEntity.status(500).body(new ErrorResponse(
                "Internal Server Error",
                "An unexpected error occurred.",
                500,
                LocalDateTime.now().toString()
        ));
    }

    private void log(Exception ex) {
        if (!cryptoAppProperties.isProduction()) {
            log.error("Exception caught: ", ex);
        }
    }
}