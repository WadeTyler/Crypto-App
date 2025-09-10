package net.tylerwade.cryptoapp.portfolio.transaction;

import lombok.RequiredArgsConstructor;
import net.tylerwade.cryptoapp.auth.AppUser;
import net.tylerwade.cryptoapp.portfolio.Portfolio;
import net.tylerwade.cryptoapp.portfolio.PortfolioService;
import net.tylerwade.cryptoapp.portfolio.holding.HoldingService;
import net.tylerwade.cryptoapp.portfolio.transaction.dto.CreateTransactionRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionDao transactionDao;
    private final PortfolioService portfolioService;
    private final HoldingService holdingService;

    public Transaction createTransaction(AppUser user, Long portfolioId, CreateTransactionRequest createTransactionRequest) {
        // Find the portfolio to ensure it exists - throws if not found
        Portfolio portfolio = portfolioService.findByIdAndUser(portfolioId, user);

        Transaction transaction = Transaction.builder()
                .portfolio(portfolio)
                .cryptoId(createTransactionRequest.cryptoId())
                .type(createTransactionRequest.type())
                .quantity(createTransactionRequest.quantity())
                .price(createTransactionRequest.price())
                .fee(createTransactionRequest.fee())
                .createdAt(LocalDateTime.now())
                .modifiedAt(LocalDateTime.now())
                .build();

        Transaction savedTransaction = transactionDao.save(transaction);
        // Update holding
        holdingService.updateHolding(getAllByCryptoId(portfolioId, createTransactionRequest.cryptoId(), user));
        // Return
        return savedTransaction;
    }

    public List<Transaction> getAllByCryptoId(Long portfolioId, String cryptoId, AppUser user) {
        return transactionDao.findAllByPortfolioIdAndCryptoIdAndPortfolio_User(portfolioId, cryptoId, user);
    }

    public List<Transaction> getAll(Long portfolioId, AppUser user) {
        return transactionDao.findAllByPortfolioIdAndPortfolio_User(portfolioId, user);
    }
}