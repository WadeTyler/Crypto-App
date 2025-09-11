package net.tylerwade.cryptoapp.coins.marketchart;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarketChart {

    private double[][] prices;
    private double[][] market_caps;
    private double[][] total_volumes;
    private LocalDateTime cachedAt;
}