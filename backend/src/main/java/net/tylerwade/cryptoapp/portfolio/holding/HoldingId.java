package net.tylerwade.cryptoapp.portfolio.holding;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.tylerwade.cryptoapp.portfolio.Portfolio;

import java.util.Objects;

@Data
@NoArgsConstructor @AllArgsConstructor
public class HoldingId {

    private String cryptoId;

    private Portfolio portfolio;

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        HoldingId holdingId = (HoldingId) o;
        return Objects.equals(cryptoId, holdingId.cryptoId) && Objects.equals(portfolio, holdingId.portfolio);
    }

    @Override
    public int hashCode() {
        return Objects.hash(cryptoId, portfolio);
    }
}