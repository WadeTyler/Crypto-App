package net.tylerwade.cryptoapp.auth.forgotpassword;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.tylerwade.cryptoapp.auth.AppUser;

import java.time.LocalDateTime;

@Entity
@Table(name = "reset_password_codes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResetPasswordCode {

    @Id
    private String userId;

    @OneToOne
    @MapsId
    private AppUser user;

    private String code;
    private LocalDateTime expiresAt;
}