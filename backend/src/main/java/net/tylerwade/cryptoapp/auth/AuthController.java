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

/**
 * REST endpoints for user authentication & account management such as
 * registration, login, logout, fetching the currently authenticated user
 * and changing passwords. Issues and manages a JWT via HTTP-only cookies.
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AppUserService userService;
    private final JwtService jwtService;

    /**
     * Return the currently authenticated user (principal) or 401 if unauthenticated.
     * @param authentication Spring Security authentication object
     * @return authenticated AppUser
     */
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public AppUser getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw HttpRequestException.unauthorized("User unauthenticated.");
        }
        return (AppUser) authentication.getPrincipal();
    }

    /**
     * Register a new user account and set a JWT cookie.
     * @param response servlet response to add cookie
     * @param registerRequest registration payload
     * @return newly created user
     */
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AppUser register(HttpServletResponse response, @RequestBody @Validated RegisterRequest registerRequest) {
        AppUser user = userService.register(registerRequest);
        String token = jwtService.generateToken(user);
        // Add token to cookies
        response.addCookie(jwtService.createCookie(token));
        return user;
    }

    /**
     * Authenticate a user and set a JWT cookie on success.
     * @param response servlet response
     * @param loginRequest login credentials
     * @return authenticated user
     */
    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public AppUser login(HttpServletResponse response, @RequestBody @Valid LoginRequest loginRequest) {
        AppUser user = userService.login(loginRequest);
        String token = jwtService.generateToken(user);
        // Add token to cookies
        response.addCookie(jwtService.createCookie(token));
        return user;
    }

    /**
     * Clear the authentication cookie (client treated as logged out).
     */
    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(HttpServletResponse response) {
        // Invalidate the JWT cookie
        response.addCookie(jwtService.createLogoutCookie());
    }

    /**
     * Initiate the forgot password process by generating a reset code and emailing it to the user.
     * @param username username (email) of the user requesting a password reset
     */
    @PostMapping("/forgot-password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void forgotPassword(@RequestParam String username) {
        userService.forgotPassword(username);
    }

    /**
     * Change the user's password using a valid reset code.
     * @param changePasswordRequest password change payload
     */
    @PatchMapping("/change-password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changePassword(@RequestBody @Valid ChangePasswordRequest changePasswordRequest) {
        userService.changePassword(changePasswordRequest);
    }
}