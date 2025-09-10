package net.tylerwade.cryptoapp.portfolio.holding;

import net.tylerwade.cryptoapp.auth.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HoldingDao extends JpaRepository<Holding, HoldingId> {

    Optional<Holding> findByCryptoIdAndPortfolioIdAndPortfolio_User(String cryptoId, Long portfolioId, AppUser user);
}