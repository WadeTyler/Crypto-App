package net.tylerwade.cryptoapp.coins;

import lombok.RequiredArgsConstructor;
import net.tylerwade.cryptoapp.config.CoinGeckoProperties;
import net.tylerwade.cryptoapp.config.CryptoAppProperties;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;


@Service
@RequiredArgsConstructor
public class CoinService {
    private final CoinGeckoProperties coinGeckoProperties;
    private final RestTemplate restTemplate = new RestTemplate();

    private final HashMap<GetCoinParams, CachedCoinPage> coinPageCache = new HashMap<>();
    private final CryptoAppProperties cryptoAppProperties;

    public Coin[] getCoins(String vsCurrency, int page, int perPage) {
        // Check coin cache
        GetCoinParams params = new GetCoinParams(vsCurrency, page, perPage);
        if (coinPageCache.containsKey(params)) {
            CachedCoinPage cachedCoinPage = coinPageCache.get(params);
            if (cachedCoinPage != null) {
                if (cryptoAppProperties.isProduction()) {
                    // In prod, cache for 2 min
                    if (cachedCoinPage.getCachedAt().isAfter(LocalDateTime.now().minusMinutes(2))) {
                        System.out.println("Cache hit for " + params);
                        return cachedCoinPage.getCoins();
                    }
                }
                else {
                    // In dev, cache for 5 min
                    if (cachedCoinPage.getCachedAt().isAfter(LocalDateTime.now().minusMinutes(5))) {
                        System.out.println("Cache hit for " + params);
                        return cachedCoinPage.getCoins();
                    }
                }
            }
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Accept", "application/json");
            headers.set("x-cg-demo-api-key", coinGeckoProperties.getApiKey());

            String url = buildUrl(String.format("/coins/markets?vs_currency=%s&page=%d&per_page=%d", vsCurrency, page, perPage));
            Coin[] coins = restTemplate.getForObject(url, Coin[].class, new HttpEntity<>(headers));

            // Write coins to cache
            CachedCoinPage cachedPage = new CachedCoinPage(coins, LocalDateTime.now());

            coinPageCache.put(params, cachedPage);

            return coins;
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