package net.tylerwade.cryptoapp.config;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "coingecko")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CoinGeckoProperties {
    private String apiUrl = "https://api.coingecko.com/api/v3";
    private String apiKey;
}