package net.tylerwade.cryptoapp.coins;

import lombok.RequiredArgsConstructor;
import net.tylerwade.cryptoapp.coins.coinpage.Coin;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/coins")
@RequiredArgsConstructor
public class CoinController {

    private final CoinService coinService;

    @GetMapping
    public Coin[] getCoins(@RequestParam("vs_currency") String vsCurrency,
                           @RequestParam(value = "page", required = false, defaultValue = "0") int page,
                           @RequestParam(value = "per_page", required = false, defaultValue = "100") int perPage,
                           @RequestParam(value = "ids", required = false, defaultValue = "") String ids) {
        return coinService.getCoins(vsCurrency, page, perPage, ids);
    }

    @GetMapping("/{id}")
    public CoinData getCoinById(@PathVariable String id) {
        return coinService.getCoinById(id);
    }
}