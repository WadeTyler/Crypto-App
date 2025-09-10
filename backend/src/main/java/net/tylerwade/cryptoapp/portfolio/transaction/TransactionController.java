package net.tylerwade.cryptoapp.portfolio.transaction;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.tylerwade.cryptoapp.auth.AppUser;
import net.tylerwade.cryptoapp.portfolio.transaction.dto.CreateTransactionRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST endpoints for creating and listing transactions (trades) within a portfolio.
 * Each transaction updates the derived holdings for the associated crypto asset.
 */
@RestController
@RequestMapping("/api/v1/portfolios/{portfolioId}/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    /**
     * Create a new transaction (buy/sell) in the specified portfolio.
     * @param authentication Spring authentication containing principal
     * @param portfolioId portfolio identifier
     * @param createTransactionRequest trade payload
     * @return created Transaction
     */
    @PostMapping
    public Transaction createTransaction(Authentication authentication,
                                         @PathVariable Long portfolioId,
                                         @RequestBody @Valid CreateTransactionRequest createTransactionRequest) {
        var user = (AppUser) authentication.getPrincipal();
        return transactionService.createTransaction(user, portfolioId, createTransactionRequest);
    }

    /**
     * Get all transactions for the specified portfolio owned by the user.
     * @param portfolioId portfolio identifier
     * @param user authenticated user principal
     * @return list of transactions
     */
    @GetMapping
    public List<Transaction> getAllByPortfolio(@PathVariable Long portfolioId,
                                               @AuthenticationPrincipal AppUser user) {
        return transactionService.getAll(portfolioId, user);
    }
}