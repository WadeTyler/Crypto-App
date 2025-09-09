package net.tylerwade.cryptoapp.coins.coinpage;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CachedCoinPage {
    private Coin[] coins;
    private LocalDateTime cachedAt;
}