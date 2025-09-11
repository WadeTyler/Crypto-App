package net.tylerwade.cryptoapp.auth.forgotpassword;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResetPasswordCodeDao extends JpaRepository<ResetPasswordCode, String> {
}