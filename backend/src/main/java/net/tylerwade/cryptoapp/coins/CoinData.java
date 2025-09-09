package net.tylerwade.cryptoapp.coins;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CoinData {

    private String id;
    private String symbol;
    private String name;
    private Description description;
    private String[] categories;
    private Links links;
    private Image image;
    private MarketData market_data;

    // Time when this data was cached
    private LocalDateTime cachedAt;

    @Getter
    @Setter
    @NoArgsConstructor
    public static class Description {
        private String en;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class Links {
        private String[] homepage;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class Image {
        private String thumb;
        private String small;
        private String large;
    }

    @Getter @Setter @NoArgsConstructor
    public static class MarketData {
        private CurrentPrice current_price;
        private MarketCap market_cap;
        private long market_cap_rank;
        private TotalVolume total_volume;
        private High24h high_24h;
        private Low24h low_24h;
        private PriceChangePercentage24InCurrency price_change_percentage_24h_in_currency;
        private double total_supply;
        private double max_supply;
        private double circulating_supply;

        @Getter @Setter @NoArgsConstructor
        public static class CurrentPrice {
            private double usd;
            private double eur;
        }

        @Getter @Setter @NoArgsConstructor
        public static class MarketCap {
            private long usd;
            private long eur;
        }

        @Getter @Setter @NoArgsConstructor
        public static class TotalVolume {
            private long usd;
            private long eur;
        }

        @Getter @Setter @NoArgsConstructor
        public static class High24h {
            private double usd;
            private double eur;
        }

        @Getter @Setter @NoArgsConstructor
        public static class Low24h {
            private double usd;
            private double eur;
        }

        @Getter @Setter @NoArgsConstructor
        public static class PriceChangePercentage24InCurrency {
            private double usd;
            private double eur;
        }
    }
}