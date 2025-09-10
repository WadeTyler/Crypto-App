package net.tylerwade.cryptoapp.portfolio.holding;

import lombok.RequiredArgsConstructor;
import net.tylerwade.cryptoapp.auth.AppUser;
import net.tylerwade.cryptoapp.common.exception.HttpRequestException;
import net.tylerwade.cryptoapp.portfolio.PortfolioService;
import net.tylerwade.cryptoapp.portfolio.transaction.Transaction;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service handling current holdings (aggregate position per crypto) derived from transactions.
 * Responsible for fetching holdings for a user portfolio and recalculating / persisting
 * a holding when underlying transactions change.
 */
@Service
@RequiredArgsConstructor
public class HoldingService {

    private final HoldingDao holdingDao;
    private final PortfolioService portfolioService;

    /**
     * Get all holdings for a given portfolio ensuring the portfolio belongs to the user.
     * @param portfolioId portfolio identifier
     * @param user authenticated user
     * @return list of Holding
     */
    public List<Holding> getAllByPortfolioIdAndUser(Long portfolioId, AppUser user) {
        var portfolio = portfolioService.findByIdAndUser(portfolioId, user);
        return portfolio.getHoldings();
    }

    /**
     * Find a single holding by crypto id within a portfolio for the user.
     * @param cryptoId coin id
     * @param portfolioId portfolio id
     * @param user authenticated user
     * @return Holding
     * @throws HttpRequestException if not found
     */
    public Holding findById(String cryptoId, Long portfolioId, AppUser user) {
        return holdingDao.findByCryptoIdAndPortfolioIdAndPortfolio_User(cryptoId, portfolioId, user)
                .orElseThrow(() -> HttpRequestException.notFound("Holding not found"));
    }

    /**
     * Recalculate and persist the holding represented by the supplied transactions. If the resulting
     * quantity is zero the holding record is removed. Assumes all transactions are for the same
     * crypto + portfolio.
     * @param transactions list of transactions for a single crypto & portfolio
     */
    @Transactional
    public void updateHolding(List<Transaction> transactions) {
        // Calculate quantity based on all transactions for cryptoId
        double quantity = 0.0;
        for (Transaction transaction : transactions) {
            if (transaction.getType().equalsIgnoreCase("buy")) {
                quantity += transaction.getQuantity();
            } else if (transaction.getType().equalsIgnoreCase("sell")) {
                quantity -= transaction.getQuantity();
            }
        }

        String cryptoId = transactions.getFirst().getCryptoId();
        Long portfolioId = transactions.getFirst().getPortfolio().getId();

        if (quantity == 0) {
            // If quantity is zero, remove the holding if it exists
            holdingDao.deleteByCryptoIdAndPortfolioId(cryptoId, portfolioId);
            return;
        }

        var portfolio = transactions.getFirst().getPortfolio();

        // Save the holding
        Holding holding = holdingDao.findByCryptoIdAndPortfolioId(cryptoId, portfolioId)
                .orElse(Holding.builder()
                        .cryptoId(cryptoId)
                        .portfolio(portfolio)
                        .createdAt(LocalDateTime.now())
                        .modifiedAt(LocalDateTime.now())
                        .build());

        // Update and Save
        holding.setQuantity(quantity);
        holdingDao.save(holding);
    }
}