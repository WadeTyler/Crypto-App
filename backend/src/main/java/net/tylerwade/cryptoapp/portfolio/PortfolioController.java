package net.tylerwade.cryptoapp.portfolio;

import lombok.RequiredArgsConstructor;
import net.tylerwade.cryptoapp.auth.AppUser;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST endpoints for managing user portfolios: create, update, list, get and delete.
 * All operations enforce ownership by the authenticated user.
 */
@RestController
@RequestMapping("/api/v1/portfolios")
@RequiredArgsConstructor
public class PortfolioController {
    private final PortfolioService portfolioService;

    /**
     * Create a new portfolio for the authenticated user.
     * @param name portfolio name
     * @param authentication Spring authentication containing principal
     * @return created portfolio
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Portfolio createPortfolio(@RequestParam String name, Authentication authentication) {
        AppUser user = (AppUser) authentication.getPrincipal();
        return portfolioService.createPortfolio(name, user);
    }

    /**
     * Update an existing portfolio's name.
     * @param portfolioId portfolio identifier
     * @param name new name
     * @param user authenticated user principal
     * @return updated portfolio
     */
    @PutMapping("/{portfolioId}")
    public Portfolio updatePortfolio(@PathVariable Long portfolioId,
                                     @RequestParam String name,
                                     @AuthenticationPrincipal AppUser user) {
        return portfolioService.updatePortfolio(portfolioId, name, user);
    }

    /**
     * List all portfolios owned by the authenticated user.
     * @param authentication Spring authentication containing principal
     * @return list of portfolios
     */
    @GetMapping
    public List<Portfolio> getAllByUser(Authentication authentication) {
        AppUser user = (AppUser) authentication.getPrincipal();
        return portfolioService.findAllByUser(user);
    }

    /**
     * Get a specific portfolio owned by the authenticated user.
     * @param portfolioId portfolio identifier
     * @param authentication auth containing principal
     * @return portfolio
     */
    @GetMapping("/{portfolioId}")
    public Portfolio getByIdAndUser(@PathVariable Long portfolioId, Authentication authentication) {
        AppUser user = (AppUser) authentication.getPrincipal();
        return portfolioService.findByIdAndUser(portfolioId, user);
    }

    /**
     * Delete a portfolio owned by the authenticated user.
     * @param portfolioId portfolio identifier
     * @param authentication auth containing principal
     */
    @DeleteMapping("/{portfolioId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePortfolio(@PathVariable Long portfolioId, Authentication authentication) {
        AppUser user = (AppUser) authentication.getPrincipal();
        portfolioService.deletePortfolio(portfolioId, user);
    }

}