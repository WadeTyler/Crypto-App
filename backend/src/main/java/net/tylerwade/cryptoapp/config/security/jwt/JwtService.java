package net.tylerwade.cryptoapp.config.security.jwt;

import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.Cookie;
import lombok.RequiredArgsConstructor;
import net.tylerwade.cryptoapp.auth.AppUser;
import net.tylerwade.cryptoapp.config.CryptoAppProperties;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Date;

/**
 * Service responsible for generating and parsing JWT tokens and creating the
 * associated auth cookies used for stateless authentication.
 */
@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtProperties jwtProperties;
    private final CryptoAppProperties cryptoAppProperties;

    /**
     * Generate a signed JWT containing basic user identity claims.
     *
     * @param user authenticated user
     * @return signed JWT token string
     */
    public String generateToken(AppUser user) {
        try {
            return Jwts.builder()
                    .subject(user.getId())
                    .claim("username", user.getUsername())
                    .claim("firstName", user.getFirstName())
                    .claim("lastName", user.getLastName())
                    .issuer(jwtProperties.getIssuer())
                    .issuedAt(new Date())
                    .expiration(Date.from(LocalDateTime.now().plusSeconds(jwtProperties.getExpirationMs() / 1000).toInstant(ZoneOffset.UTC)))
                    .signWith(jwtProperties.getSecretKey())
                    .compact();
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Extract the user id (subject) from a JWT token.
     *
     * @param token JWT token string
     * @return user id (subject)
     */
    public String extractUserIdFromToken(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(jwtProperties.getSecretKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload().getSubject();
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Create an HTTP-only cookie holding the JWT for client auth.
     *
     * @param token JWT token
     * @return configured Cookie
     */
    public Cookie createCookie(String token) {
        Cookie cookie = new Cookie(JwtProperties.AUTH_TOKEN_COOKIE_NAME, token);
        cookie.setHttpOnly(true);
        cookie.setSecure(cryptoAppProperties.isProduction()); // Use secure cookies in production
        cookie.setPath("/");
        cookie.setMaxAge((int) (jwtProperties.getExpirationMs() / 1000));
        return cookie;
    }

    /**
     * Create a cookie that clears the auth token (logout helper).
     *
     * @return clearing Cookie
     */
    public Cookie createLogoutCookie() {
        Cookie cookie = new Cookie(JwtProperties.AUTH_TOKEN_COOKIE_NAME, "");
        cookie.setHttpOnly(true);
        cookie.setSecure(cryptoAppProperties.isProduction()); // Use secure cookies in production
        cookie.setPath("/");
        cookie.setMaxAge(0);
        return cookie;
    }

}