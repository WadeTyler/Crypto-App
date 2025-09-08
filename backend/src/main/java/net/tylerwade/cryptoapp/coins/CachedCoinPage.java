package net.tylerwade.cryptoapp.coins;

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