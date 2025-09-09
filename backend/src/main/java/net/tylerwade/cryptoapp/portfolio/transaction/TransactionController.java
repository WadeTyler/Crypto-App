package net.tylerwade.cryptoapp.portfolio.transaction;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.tylerwade.cryptoapp.auth.AppUser;
import net.tylerwade.cryptoapp.portfolio.transaction.dto.CreateTransactionRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/portfolios/{portfolioId}/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping
    public Transaction createTransaction(Authentication authentication,
                                         @PathVariable Long portfolioId,
                                         @RequestBody @Valid CreateTransactionRequest createTransactionRequest) {
        var user = (AppUser) authentication.getPrincipal();
        return transactionService.createTransaction(user, portfolioId, createTransactionRequest);
    }

    @GetMapping
    public List<Transaction> getAllByPortfolio(@PathVariable Long portfolioId,
                                               @AuthenticationPrincipal AppUser user) {
        return transactionService.getAll(portfolioId, user);
    }
}