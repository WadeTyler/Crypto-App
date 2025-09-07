package net.tylerwade.cryptoapp.config.security.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import net.tylerwade.cryptoapp.auth.AppUser;
import net.tylerwade.cryptoapp.auth.AppUserService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final AppUserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Get the token
        String token = extractToken(request);
        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // Verify the token
            String userId = jwtService.extractUserIdFromToken(token);

            // Get the user details
            AppUser user = userService.findById(userId);

            // Set user details in SecurityContext
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    user,
                    null,
                    user.getAuthorities()
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (Exception e) {
            filterChain.doFilter(request, response);
            return;
        }

        // Continue filter chain
        filterChain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader(JwtProperties.AUTH_HEADER_NAME);
        if (bearerToken == null || !bearerToken.startsWith(JwtProperties.BEARER_PREFIX)) {
            // Get from cookie
            if (request.getCookies() != null) {
                for (Cookie cookie : request.getCookies()) {
                    if (cookie.getName().equalsIgnoreCase(JwtProperties.AUTH_TOKEN_COOKIE_NAME)) {
                        return cookie.getValue();
                    }
                }
            }
            // Cookie not found
            return null;
        }
        return bearerToken.substring(JwtProperties.BEARER_PREFIX.length());
    }
}