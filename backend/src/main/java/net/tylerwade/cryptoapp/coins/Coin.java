package net.tylerwade.cryptoapp.coins;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Coin {

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    static class Roi {
        private double times;
        private String currency;
        private double percentage;
    }

    private String id;
    private String symbol;
    private String name;
    private String image;
    private long currentPrice;
    private long marketCap;
    private int marketCapRank;
    private long fullyDilutedValuation;
    private long totalVolume;
    private long high24h;
    private long low24h;
    private double priceChange24h;
    private double priceChangePercentage24h;
    private long marketCapChange24h;
    private double marketCapChangePercentage24h;
    private long circulatingSupply;
    private long totalSupply;
    private long maxSupply;
    private long ath;
    private double athChangePercentage;
    private String athDate;
    private double atl;
    private double atlChangePercentage;
    private String atlDate;
    private Roi roi;
    private String lastUpdated;
}