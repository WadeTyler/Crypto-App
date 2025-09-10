package net.tylerwade.cryptoapp.portfolio.transaction;

import net.tylerwade.cryptoapp.auth.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionDao extends JpaRepository<Transaction, Long> {
    List<Transaction> findAllByPortfolioIdAndPortfolio_User(Long portfolioId, AppUser user);

    List<Transaction> findAllByPortfolioIdAndCryptoIdAndPortfolio_User(Long portfolioId, String cryptoId, AppUser user);
}