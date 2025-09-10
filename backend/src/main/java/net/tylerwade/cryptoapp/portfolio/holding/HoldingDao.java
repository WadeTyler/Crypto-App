package net.tylerwade.cryptoapp.portfolio.holding;

import net.tylerwade.cryptoapp.auth.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface HoldingDao extends JpaRepository<Holding, HoldingId> {

    Optional<Holding> findByCryptoIdAndPortfolioIdAndPortfolio_User(String cryptoId, Long portfolioId, AppUser user);

    Optional<Holding> findByCryptoIdAndPortfolioId(String cryptoId, Long id);

    @Transactional
    @Modifying
    void deleteByCryptoIdAndPortfolioId(String cryptoId, Long id);
}