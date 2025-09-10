package net.tylerwade.cryptoapp.portfolio.holding;

import lombok.RequiredArgsConstructor;
import net.tylerwade.cryptoapp.auth.AppUser;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/portfolios/{portfolioId}/holdings")
@RequiredArgsConstructor
public class HoldingController {

    private final HoldingService holdingService;


    @GetMapping
    public List<Holding> getAllByPortfolio(@PathVariable Long portfolioId, @AuthenticationPrincipal AppUser user) {
        return holdingService.getAllByPortfolioIdAndUser(portfolioId, user);
    }

    @GetMapping("/{cryptoId}")
    public Holding findByCryptoId(@PathVariable Long portfolioId,
                                  @PathVariable String cryptoId,
                                  @AuthenticationPrincipal AppUser user) {
        return holdingService.findById(cryptoId, portfolioId, user);
    }
}