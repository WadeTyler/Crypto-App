package net.tylerwade.cryptoapp.coins;

import lombok.RequiredArgsConstructor;
import net.tylerwade.cryptoapp.config.CoinGeckoProperties;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;


@Service
@RequiredArgsConstructor
public class CoinService {
    private final CoinGeckoProperties coinGeckoProperties;
    private final RestTemplate restTemplate = new RestTemplate();

    public Coin[] getCoins(String vsCurrency, int page, int perPage) {

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Accept", "application/json");
            headers.set("x-cg-demo-api-key", coinGeckoProperties.getApiKey());

            String url = buildUrl(String.format("/coins/markets?vs_currency=%s&page=%d&per_page=%d", vsCurrency, page, perPage));
            return restTemplate.getForObject(url, Coin[].class, new HttpEntity<>(headers));
        } catch (RestClientException e) {
            throw new RuntimeException(e);
        }
    }

    private String buildUrl(String path) {
        StringBuilder urlBuilder = new StringBuilder(coinGeckoProperties.getApiUrl());
        urlBuilder.append(path);
        return urlBuilder.toString();
    }
}