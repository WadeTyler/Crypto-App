package net.tylerwade.cryptoapp.config.security.jwt;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;

@ConfigurationProperties(prefix = "cryptoapp.jwt")
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class JwtProperties {
    public static final String AUTH_HEADER_NAME = "Authorization";
    public static final String BEARER_PREFIX = "Bearer ";
    public static final String AUTH_TOKEN_COOKIE_NAME = "auth_token";

    private String secret;
    private long expirationMs;
    private String issuer = "cryptoapp";

    public SecretKey getSecretKey() throws UnsupportedEncodingException {
        return new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
    }
}