package net.tylerwade.cryptoapp.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AppUserDao extends JpaRepository<AppUser, String> {
    boolean existsByUsernameIgnoreCase(String username);

    Optional<AppUser> findByUsernameIgnoreCase(String username);
}