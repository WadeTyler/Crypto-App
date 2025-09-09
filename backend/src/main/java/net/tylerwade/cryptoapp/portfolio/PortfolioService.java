package net.tylerwade.cryptoapp.portfolio;

import lombok.RequiredArgsConstructor;
import net.tylerwade.cryptoapp.auth.AppUser;
import net.tylerwade.cryptoapp.common.exception.HttpRequestException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PortfolioService {
    private final PortfolioDao portfolioDao;


    public Portfolio createPortfolio(String name, AppUser user) {
        // Check if a portfolio with the same name exists
        if (portfolioDao.existsByNameAndUser(name, user)) {
            throw HttpRequestException.badRequest("You already a portfolio with that name.");
        }

        // Create and save the new portfolio
        Portfolio portfolio = Portfolio.builder()
                .name(name)
                .user(user)
                .createdAt(LocalDateTime.now())
                .modifiedAt(LocalDateTime.now())
                .build();

        return portfolioDao.save(portfolio);
    }

    public List<Portfolio> findAllByUser(AppUser user) {
        return portfolioDao.findAllByUser(user);
    }

    public Portfolio findByIdAndUser(Long id, AppUser user) {
        return portfolioDao.findByIdAndUser(id, user)
                .orElseThrow(() -> HttpRequestException.notFound("Portfolio not found."));
    }

    public void deletePortfolio(Long id, AppUser user) {
        var portfolio = findByIdAndUser(id, user);
        portfolioDao.delete(portfolio);
    }

}