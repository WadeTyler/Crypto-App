package net.tylerwade.cryptoapp.config;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "cryptoapp")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class CryptoAppProperties {

    private String environment = "development"; // default to development

    public boolean isProduction() {
        return environment.equalsIgnoreCase("production");
    }


}