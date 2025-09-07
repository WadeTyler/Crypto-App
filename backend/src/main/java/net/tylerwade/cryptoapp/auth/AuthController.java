package net.tylerwade.cryptoapp.auth;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.tylerwade.cryptoapp.auth.dto.ChangePasswordRequest;
import net.tylerwade.cryptoapp.auth.dto.LoginRequest;
import net.tylerwade.cryptoapp.auth.dto.RegisterRequest;
import net.tylerwade.cryptoapp.common.exception.HttpRequestException;
import net.tylerwade.cryptoapp.config.security.jwt.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AppUserService userService;
    private final JwtService jwtService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public AppUser getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw HttpRequestException.unauthorized("User unauthenticated.");
        }
        return (AppUser) authentication.getPrincipal();
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AppUser register(HttpServletResponse response, @RequestBody @Validated RegisterRequest registerRequest) {
        AppUser user = userService.register(registerRequest);
        String token = jwtService.generateToken(user);
        // Add token to cookies
        response.addCookie(jwtService.createCookie(token));
        return user;
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public AppUser login(HttpServletResponse response, @RequestBody @Valid LoginRequest loginRequest) {
        AppUser user = userService.login(loginRequest);
        String token = jwtService.generateToken(user);
        // Add token to cookies
        response.addCookie(jwtService.createCookie(token));
        return user;
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(HttpServletResponse response) {
        // Invalidate the JWT cookie
        response.addCookie(jwtService.createLogoutCookie());
    }


    @PatchMapping("/change-password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changePassword(Authentication authentication, @RequestBody @Valid ChangePasswordRequest changePasswordRequest) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw HttpRequestException.unauthorized("User unauthenticated.");
        }
        AppUser user = (AppUser) authentication.getPrincipal();
        userService.changePassword(user, changePasswordRequest);
    }
}