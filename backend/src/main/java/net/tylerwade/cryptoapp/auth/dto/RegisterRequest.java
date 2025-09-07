package net.tylerwade.cryptoapp.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(

        @NotBlank
        @Size(min = 1, max = 50)
        String firstName,

        @NotBlank
        @Size(min = 1, max = 50)
        String lastName,

        @NotBlank
        @Size(min = 3, max = 255)
        @Email
        String username,

        @NotBlank
        @Size(min = 8, max = 255)
        String password,

        @NotBlank
        @Size(min = 8, max = 255)
        String verifyPassword
) {
}