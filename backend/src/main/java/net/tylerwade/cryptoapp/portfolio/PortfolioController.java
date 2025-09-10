package net.tylerwade.cryptoapp.portfolio;

import lombok.RequiredArgsConstructor;
import net.tylerwade.cryptoapp.auth.AppUser;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/portfolios")
@RequiredArgsConstructor
public class PortfolioController {
    private final PortfolioService portfolioService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Portfolio createPortfolio(@RequestParam String name, Authentication authentication) {
        AppUser user = (AppUser) authentication.getPrincipal();
        return portfolioService.createPortfolio(name, user);
    }

    @PutMapping("/{portfolioId}")
    public Portfolio updatePortfolio(@PathVariable Long portfolioId,
                                     @RequestParam String name,
                                     @AuthenticationPrincipal AppUser user) {
        return portfolioService.updatePortfolio(portfolioId, name, user);
    }

    @GetMapping
    public List<Portfolio> getAllByUser(Authentication authentication) {
        AppUser user = (AppUser) authentication.getPrincipal();
        return portfolioService.findAllByUser(user);
    }

    @GetMapping("/{portfolioId}")
    public Portfolio getByIdAndUser(@PathVariable Long portfolioId, Authentication authentication) {
        AppUser user = (AppUser) authentication.getPrincipal();
        return portfolioService.findByIdAndUser(portfolioId, user);
    }

    @DeleteMapping("/{portfolioId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePortfolio(@PathVariable Long portfolioId, Authentication authentication) {
        AppUser user = (AppUser) authentication.getPrincipal();
        portfolioService.deletePortfolio(portfolioId, user);
    }

}