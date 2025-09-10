package net.tylerwade.cryptoapp.portfolio;

import lombok.RequiredArgsConstructor;
import net.tylerwade.cryptoapp.auth.AppUser;
import net.tylerwade.cryptoapp.common.exception.HttpRequestException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service for CRUD style operations on user portfolios.
 * Ensures portfolio name uniqueness per user and enforces ownership on lookups / mutations.
 */
@Service
@RequiredArgsConstructor
public class PortfolioService {
    private final PortfolioDao portfolioDao;

    /**
     * Create a new portfolio for the user if the name is not already taken.
     * @param name portfolio name
     * @param user owner
     * @return created Portfolio
     * @throws HttpRequestException if name already exists for user
     */
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

    /**
     * Update an existing portfolio's name (ensuring uniqueness within user's portfolios).
     * @param id portfolio id
     * @param newName new desired name
     * @param user owner
     * @return updated Portfolio
     * @throws HttpRequestException if new name already used by another portfolio of the user
     */
    public Portfolio updatePortfolio(Long id, String newName, AppUser user) {
        var portfolio = findByIdAndUser(id, user);
        // Check if a portfolio with the new name exists (excluding the current portfolio)
        if (portfolioDao.existsByNameAndUserAndIdNot(newName, user, id)) {
            throw HttpRequestException.badRequest("You already a portfolio with that name.");
        }

        portfolio.setName(newName);
        return portfolioDao.save(portfolio);
    }

    /**
     * List all portfolios belonging to the user.
     * @param user owner
     * @return list of Portfolio
     */
    public List<Portfolio> findAllByUser(AppUser user) {
        return portfolioDao.findAllByUser(user);
    }

    /**
     * Find a single portfolio by id enforcing user ownership.
     * @param id portfolio id
     * @param user owner
     * @return Portfolio
     * @throws HttpRequestException if not found
     */
    public Portfolio findByIdAndUser(Long id, AppUser user) {
        return portfolioDao.findByIdAndUser(id, user)
                .orElseThrow(() -> HttpRequestException.notFound("Portfolio not found."));
    }

    /**
     * Delete a portfolio owned by the user.
     * @param id portfolio id
     * @param user owner
     */
    public void deletePortfolio(Long id, AppUser user) {
        var portfolio = findByIdAndUser(id, user);
        portfolioDao.delete(portfolio);
    }

}