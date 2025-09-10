package net.tylerwade.cryptoapp.coins.query;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchCoin {
    private String id;
    private String name;
    private String api_symbol;
    private int market_cap_rank;
    private String thumb;
    private String large;
}