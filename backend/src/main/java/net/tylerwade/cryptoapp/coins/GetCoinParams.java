package net.tylerwade.cryptoapp.coins;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class GetCoinParams {
    private String vsCurrency;
    private int page;
    private int perPage;


}