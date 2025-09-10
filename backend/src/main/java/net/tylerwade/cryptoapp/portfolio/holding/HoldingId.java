package net.tylerwade.cryptoapp.portfolio.holding;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor @AllArgsConstructor
public class HoldingId {

    @Id
    private String cryptoId;

    @Id
    @Column(name = "portfolio_id")
    private Long portfolioId;
}