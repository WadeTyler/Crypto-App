package net.tylerwade.cryptoapp.coins.coinpage;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class GetCoinPageParams {
    private String vsCurrency;
    private int page;
    private int perPage;
    private String ids;


}