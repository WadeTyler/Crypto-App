package net.tylerwade.cryptoapp.portfolio.transaction.dto;

public record CreateTransactionRequest(
        String cryptoId,
        String type,
        double quantity,
        double price,
        double fee
) {
}