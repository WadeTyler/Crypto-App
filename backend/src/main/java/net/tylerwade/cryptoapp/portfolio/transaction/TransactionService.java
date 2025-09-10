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

/**
 * Service for creating and retrieving portfolio transactions. Responsible for
 * persisting trades and triggering holding recalculation for the affected crypto.
 */
@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionDao transactionDao;
    private final PortfolioService portfolioService;
    private final HoldingService holdingService;

    /**
     * Create a new transaction (buy / sell) for the user's portfolio and update the corresponding holding.
     * @param user authenticated user
     * @param portfolioId portfolio identifier
     * @param createTransactionRequest request payload with trade details
     * @return saved Transaction
     */
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
        // Update holding after persisting transaction
        holdingService.updateHolding(getAllByCryptoId(portfolioId, createTransactionRequest.cryptoId(), user));
        // Return
        return savedTransaction;
    }

    /**
     * Get all transactions for a crypto in the user's portfolio.
     * @param portfolioId portfolio identifier
     * @param cryptoId coin id
     * @param user authenticated user
     * @return list of Transaction
     */
    public List<Transaction> getAllByCryptoId(Long portfolioId, String cryptoId, AppUser user) {
        return transactionDao.findAllByPortfolioIdAndCryptoIdAndPortfolio_User(portfolioId, cryptoId, user);
    }

    /**
     * Get all transactions in a portfolio for the user.
     * @param portfolioId portfolio identifier
     * @param user authenticated user
     * @return list of Transaction
     */
    public List<Transaction> getAll(Long portfolioId, AppUser user) {
        return transactionDao.findAllByPortfolioIdAndPortfolio_User(portfolioId, user);
    }
}