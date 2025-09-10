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