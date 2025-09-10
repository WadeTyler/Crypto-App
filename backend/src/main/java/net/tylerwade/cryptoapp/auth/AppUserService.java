package net.tylerwade.cryptoapp.auth;

import lombok.RequiredArgsConstructor;
import net.tylerwade.cryptoapp.auth.dto.ChangePasswordRequest;
import net.tylerwade.cryptoapp.auth.dto.LoginRequest;
import net.tylerwade.cryptoapp.auth.dto.RegisterRequest;
import net.tylerwade.cryptoapp.common.exception.HttpRequestException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Service layer for user account operations such as registration, authentication,
 * password changes and user lookup required by Spring Security.
 */
@Service
@RequiredArgsConstructor
public class AppUserService implements UserDetailsService {
    private final AppUserDao appUserDao;
    private final PasswordEncoder passwordEncoder;

    /**
     * Find a user by id or throw 404 style exception.
     * @param id user id
     * @return AppUser
     * @throws HttpRequestException when user not found
     */
    public AppUser findById(String id) throws HttpRequestException {
        return appUserDao.findById(id)
                .orElseThrow(() -> HttpRequestException.notFound("User not found."));
    }

    /**
     * Loads the user for Spring Security authentication pipeline.
     * @param username supplied username (case-insensitive)
     * @return UserDetails implementation (AppUser)
     * @throws UsernameNotFoundException if no user present
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return appUserDao.findByUsernameIgnoreCase(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    /**
     * Register a new user ensuring the username is unique.
     * @param registerRequest registration payload
     * @return newly created user
     */
    public AppUser register(RegisterRequest registerRequest) {
        // Check if user exists by username
        if (appUserDao.existsByUsernameIgnoreCase(registerRequest.username())) {
            throw HttpRequestException.conflict("Email already exists.");
        }

        // Create new user
        AppUser newUser = AppUser.builder()
                .username(registerRequest.username())
                .password(passwordEncoder.encode(registerRequest.password())) // Encode password
                .firstName(registerRequest.firstName())
                .lastName(registerRequest.lastName())
                .build();

        return appUserDao.save(newUser);
    }

    /**
     * Authenticate the user using username and password.
     * @param request login payload
     * @return existing user if credentials match
     * @throws HttpRequestException unauthorized if invalid credentials
     */
    public AppUser login(LoginRequest request) {
            AppUser existingUser = appUserDao.findByUsernameIgnoreCase(request.username())
                    .orElseThrow(() -> HttpRequestException.unauthorized("Invalid email or password."));
            if (!passwordEncoder.matches(request.password(), existingUser.getPassword())) {
                throw HttpRequestException.unauthorized("Invalid email or password.");
            }
            return existingUser;
    }

    /**
     * Change a user's password after validating current password and new password confirmation.
     * @param user authenticated user
     * @param changePasswordRequest change password payload
     */
    public void changePassword(AppUser user, ChangePasswordRequest changePasswordRequest) {
        if (!passwordEncoder.matches(changePasswordRequest.currentPassword(), user.getPassword())) {
            throw HttpRequestException.unauthorized("Current password is incorrect.");
        }

        if (!changePasswordRequest.newPassword().equals(changePasswordRequest.verifyNewPassword())) {
            throw HttpRequestException.badRequest("New password and verify new password do not match.");
        }
        user.setPassword(passwordEncoder.encode(changePasswordRequest.newPassword()));
        appUserDao.save(user);
    }

}