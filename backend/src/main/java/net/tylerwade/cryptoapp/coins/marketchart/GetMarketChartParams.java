package net.tylerwade.cryptoapp.coins.marketchart;

public record GetMarketChartParams(
        String id,
        int days,
        String vs_currency
) {
}