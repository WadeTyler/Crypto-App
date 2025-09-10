package net.tylerwade.cryptoapp.portfolio.holding;

import lombok.RequiredArgsConstructor;
import net.tylerwade.cryptoapp.auth.AppUser;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST endpoints for retrieving holdings (aggregated positions) for a user's portfolio.
 */
@RestController
@RequestMapping("/api/v1/portfolios/{portfolioId}/holdings")
@RequiredArgsConstructor
public class HoldingController {

    private final HoldingService holdingService;

    /**
     * Get all holdings for a portfolio owned by the authenticated user.
     * @param portfolioId portfolio identifier
     * @param user authenticated user principal
     * @return list of holdings
     */
    @GetMapping
    public List<Holding> getAllByPortfolio(@PathVariable Long portfolioId, @AuthenticationPrincipal AppUser user) {
        return holdingService.getAllByPortfolioIdAndUser(portfolioId, user);
    }

    /**
     * Get a specific holding by crypto id within the portfolio.
     * @param portfolioId portfolio identifier
     * @param cryptoId crypto asset id
     * @param user authenticated user principal
     * @return holding
     */
    @GetMapping("/{cryptoId}")
    public Holding findByCryptoId(@PathVariable Long portfolioId,
                                  @PathVariable String cryptoId,
                                  @AuthenticationPrincipal AppUser user) {
        return holdingService.findById(cryptoId, portfolioId, user);
    }
}