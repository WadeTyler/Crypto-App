package net.tylerwade.cryptoapp.coins.query;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SearchResult {
    private SearchCoin[] coins;
    private LocalDateTime cachedAt;
}