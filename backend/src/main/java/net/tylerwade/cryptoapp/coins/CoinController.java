package net.tylerwade.cryptoapp.coins;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/coins")
@RequiredArgsConstructor
public class CoinController {

    private final CoinService coinService;

    @GetMapping
    public Coin[] getCoins(@RequestParam("vs_currency") String vsCurrency,
                           @RequestParam(value = "page", required = false, defaultValue = "0") int page,
                           @RequestParam(value = "per_page", required = false, defaultValue = "100") int perPage) {
        return coinService.getCoins(vsCurrency, page, perPage);
    }
}