package net.tylerwade.cryptoapp.portfolio.holding;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.tylerwade.cryptoapp.portfolio.Portfolio;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "holdings")
/*
 * Entity representing the aggregate position (quantity) for a specific crypto
 * within a portfolio. Quantity is derived from related buy/sell transactions.
 */
@Data
@NoArgsConstructor @AllArgsConstructor @Builder
@IdClass(HoldingId.class)
public class Holding {

    @Id
    private String cryptoId;

    @Id
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "portfolio_id")
    @JsonIgnore
    private Portfolio portfolio;

    private Double quantity;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime modifiedAt;
}