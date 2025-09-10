package net.tylerwade.cryptoapp.coins;

import lombok.RequiredArgsConstructor;
import net.tylerwade.cryptoapp.coins.coinpage.Coin;
import net.tylerwade.cryptoapp.coins.query.SearchResult;
import org.springframework.web.bind.annotation.*;

/**
 * REST endpoints for retrieving cryptocurrency market data and performing
 * search queries against the external data provider (CoinGecko API).
 */
@RestController
@RequestMapping("/api/v1/coins")
@RequiredArgsConstructor
public class CoinController {

    private final CoinService coinService;

    /**
     * Get a page of market coins optionally filtered by ids.
     * @param vsCurrency fiat currency code (e.g. usd)
     * @param page page number
     * @param perPage page size
     * @param ids comma separated coin ids (optional)
     * @return array of coins
     */
    @GetMapping
    public Coin[] getCoins(@RequestParam("vs_currency") String vsCurrency,
                           @RequestParam(value = "page", required = false, defaultValue = "0") int page,
                           @RequestParam(value = "per_page", required = false, defaultValue = "100") int perPage,
                           @RequestParam(value = "ids", required = false, defaultValue = "") String ids) {
        return coinService.getCoins(vsCurrency, page, perPage, ids);
    }

    /**
     * Retrieve detailed data for a single coin.
     * @param id coin id
     * @return coin data
     */
    @GetMapping("/{id}")
    public CoinData getCoinById(@PathVariable String id) {
        return coinService.getCoinById(id);
    }

    /**
     * Search for coins, exchanges and categories by query string.
     * @param query search term
     * @return search results
     */
    @GetMapping("/search")
    public SearchResult search(@RequestParam("query") String query) {
        return coinService.searchCoins(query);
    }
}