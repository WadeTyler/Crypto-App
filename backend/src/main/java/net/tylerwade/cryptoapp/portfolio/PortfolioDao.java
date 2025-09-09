package net.tylerwade.cryptoapp.portfolio;

import net.tylerwade.cryptoapp.auth.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PortfolioDao extends JpaRepository<Portfolio, Long> {
    boolean existsByNameAndUser(String name, AppUser user);

    List<Portfolio> findAllByUser(AppUser user);

    Optional<Portfolio> findByIdAndUser(Long id, AppUser user);
}