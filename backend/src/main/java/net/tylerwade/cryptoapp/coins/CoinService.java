package net.tylerwade.cryptoapp.coins;

import lombok.RequiredArgsConstructor;
import net.tylerwade.cryptoapp.coins.coinpage.CachedCoinPage;
import net.tylerwade.cryptoapp.coins.coinpage.Coin;
import net.tylerwade.cryptoapp.coins.coinpage.GetCoinPageParams;
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
    private final CryptoAppProperties cryptoAppProperties;

    private final RestTemplate restTemplate = new RestTemplate();
    private final HashMap<GetCoinPageParams, CachedCoinPage> coinPageCache = new HashMap<>();
    private final HashMap<String, CoinData> coinDataCache = new HashMap<>();


    public Coin[] getCoins(String vsCurrency, int page, int perPage) {
        // Check coin cache
        GetCoinPageParams params = new GetCoinPageParams(vsCurrency, page, perPage);
        if (coinPageCache.containsKey(params)) {
            CachedCoinPage cachedCoinPage = coinPageCache.get(params);
            if (cachedCoinPage != null) {
                if (cryptoAppProperties.isProduction()) {
                    // In prod, cache for 2 min
                    if (cachedCoinPage.getCachedAt().isAfter(LocalDateTime.now().minusMinutes(2))) {
                        System.out.println("Cache hit for " + params);
                        return cachedCoinPage.getCoins();
                    }
                } else {
                    // In dev, cache for 10 min
                    if (cachedCoinPage.getCachedAt().isAfter(LocalDateTime.now().minusMinutes(10))) {
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


    public CoinData getCoinById(String id) {
        if (coinDataCache.containsKey(id)) {
            // Check cache
            CoinData cachedData = coinDataCache.get(id);
            if (cachedData != null) {
                if (cryptoAppProperties.isProduction()) {
                    // In prod, cache for 2 min
                    if (cachedData.getCachedAt() != null && cachedData.getCachedAt().isAfter(LocalDateTime.now().minusMinutes(2))) {
                        System.out.println("Cache hit for coin " + id);
                        return cachedData;
                    }
                } else {
                    // In dev, cache for 10 min
                    if (cachedData.getCachedAt() != null && cachedData.getCachedAt().isAfter(LocalDateTime.now().minusMinutes(10))) {
                        System.out.println("Cache hit for coin " + id);
                        return cachedData;
                    }
                }
            }
        }

        // No cache, fetch from API
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Accept", "application/json");
            headers.set("x-cg-demo-api-key", coinGeckoProperties.getApiKey());

            String url = buildUrl(String.format("/coins/%s?tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false", id));

            CoinData coinData = restTemplate.getForObject(url, CoinData.class, new HttpEntity<>(headers));
            if (coinData != null) {
                coinData.setCachedAt(LocalDateTime.now());
                coinDataCache.put(id, coinData);
                return coinData;
            } else {
                throw new RuntimeException("Coin data is null for id: " + id);
            }
        } catch (RestClientException e) {
            throw new RuntimeException(e);
        }
    }

    private String buildUrl(String path) {
        return coinGeckoProperties.getApiUrl() + path;
    }
}