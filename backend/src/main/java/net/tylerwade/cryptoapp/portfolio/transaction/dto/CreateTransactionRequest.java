package net.tylerwade.cryptoapp.portfolio.transaction.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateTransactionRequest(

        @NotBlank
        @Size(max = 255)
        String cryptoId,

        @NotBlank
        @Size(max = 10)
        @Pattern(regexp = "buy|sell", message = "Type must be either 'buy' or 'sell'")
        String type,

        @NotNull(message = "Quantity must be provided, use 0 if no quantity")
        double quantity,

        @NotNull(message = "Price must be provided, use 0 if no price")
        double price,

        @NotNull(message = "Fee must be provided, use 0 if no fee")
        double fee
) {
}