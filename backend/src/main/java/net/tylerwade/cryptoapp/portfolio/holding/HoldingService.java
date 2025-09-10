package net.tylerwade.cryptoapp.portfolio.holding;

import lombok.RequiredArgsConstructor;
import net.tylerwade.cryptoapp.auth.AppUser;
import net.tylerwade.cryptoapp.common.exception.HttpRequestException;
import net.tylerwade.cryptoapp.portfolio.PortfolioService;
import net.tylerwade.cryptoapp.portfolio.transaction.Transaction;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HoldingService {

    private final HoldingDao holdingDao;
    private final PortfolioService portfolioService;

    public List<Holding> getAllByPortfolioIdAndUser(Long portfolioId, AppUser user) {
        var portfolio = portfolioService.findByIdAndUser(portfolioId, user);
        return portfolio.getHoldings();
    }

    public Holding findById(String cryptoId, Long portfolioId, AppUser user) {
        return holdingDao.findByCryptoIdAndPortfolioIdAndPortfolio_User(cryptoId, portfolioId, user)
                .orElseThrow(() -> HttpRequestException.notFound("Holding not found"));
    }

    public void updateHoldingFromTransaction(Transaction transaction) {
        // Get existing holding
        Holding holding = holdingDao.findById(new HoldingId(transaction.getCryptoId(), transaction.getPortfolio().getId()))
                // If not found, create a new holding with quantity 0
                .orElse(Holding.builder()
                        .cryptoId(transaction.getCryptoId())
                        .portfolio(transaction.getPortfolio())
                        .quantity(0.0)
                        .createdAt(LocalDateTime.now())
                        .modifiedAt(LocalDateTime.now())
                        .build());

        // Update quantity based on transaction type
        if (transaction.getType().equalsIgnoreCase("buy")) {
            // If buying add to quantity
            holding.setQuantity(holding.getQuantity() + transaction.getQuantity());
        } else if (transaction.getType().equalsIgnoreCase("sell")) {
            // If selling subtract from quantity
            holding.setQuantity(holding.getQuantity() - transaction.getQuantity());

            // If quantity goes to zero or below, remove the holding
            if (holding.getQuantity() <= 0) {
                holdingDao.delete(holding);
                return;
            }
        } else {
            throw new IllegalArgumentException("Invalid transaction type: " + transaction.getType());
        }

        holdingDao.save(holding);
    }
}