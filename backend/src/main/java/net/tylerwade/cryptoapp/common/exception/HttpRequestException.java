package net.tylerwade.cryptoapp.common.exception;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
public class HttpRequestException extends RuntimeException {

    private final HttpStatus httpStatus;

    public HttpRequestException(String message, HttpStatus httpStatus) {
        super(message);
        this.httpStatus = httpStatus;
    }

    public HttpRequestException(String message, Throwable cause, HttpStatus httpStatus) {
        super(message, cause);
        this.httpStatus = httpStatus;
    }

    public HttpRequestException(Throwable cause, HttpStatus httpStatus) {
        super(cause);
        this.httpStatus = httpStatus;
    }

    public HttpRequestException(HttpStatus httpStatus) {
        super(httpStatus.getReasonPhrase());
        this.httpStatus = httpStatus;
    }

    public HttpRequestException(String message) {
        super(message);
        this.httpStatus = HttpStatus.INTERNAL_SERVER_ERROR; // Default to 500 if not specified
    }

    // Factory methods for common HTTP status exceptions

    public static HttpRequestException notFound(String message) {
        return new HttpRequestException(message, HttpStatus.NOT_FOUND);
    }

    public static HttpRequestException badRequest(String message) {
        return new HttpRequestException(message, HttpStatus.BAD_REQUEST);
    }

    public static HttpRequestException internalServerError(String message) {
        return new HttpRequestException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public static HttpRequestException unauthorized(String message) {
        return new HttpRequestException(message, HttpStatus.UNAUTHORIZED);
    }

    public static HttpRequestException forbidden(String message) {
        return new HttpRequestException(message, HttpStatus.FORBIDDEN);
    }

    public static HttpRequestException conflict(String message) {
        return new HttpRequestException(message, HttpStatus.CONFLICT);
    }

}