package net.tylerwade.cryptoapp.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(

        @NotBlank
        String currentPassword,

        @NotBlank
        @Size(min = 8, max = 255)
        String newPassword,

        @NotBlank
        @Size(min = 8, max = 255)
        String verifyNewPassword
) {
}