package net.tylerwade.cryptoapp.auth;

import lombok.RequiredArgsConstructor;
import net.tylerwade.cryptoapp.auth.dto.ChangePasswordRequest;
import net.tylerwade.cryptoapp.auth.dto.LoginRequest;
import net.tylerwade.cryptoapp.auth.dto.RegisterRequest;
import net.tylerwade.cryptoapp.auth.forgotpassword.ResetPasswordCode;
import net.tylerwade.cryptoapp.auth.forgotpassword.ResetPasswordCodeDao;
import net.tylerwade.cryptoapp.common.exception.HttpRequestException;
import net.tylerwade.cryptoapp.config.CryptoAppProperties;
import net.tylerwade.cryptoapp.mail.MailService;
import net.tylerwade.cryptoapp.mail.SendMailRequest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Service layer for user account operations such as registration, authentication,
 * password changes and user lookup required by Spring Security.
 */
@Service
@RequiredArgsConstructor
public class AppUserService implements UserDetailsService {
    private final AppUserDao appUserDao;
    private final PasswordEncoder passwordEncoder;
    private final ResetPasswordCodeDao resetPasswordCodeDao;
    private final MailService mailService;
    private final CryptoAppProperties cryptoAppProperties;

    /**
     * Find a user by id or throw 404 style exception.
     *
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
     *
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
     *
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
     *
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
     * Change the user's password using a valid reset code.
     * @param changePasswordRequest password change payload
     */
    public void changePassword(ChangePasswordRequest changePasswordRequest) {
        // Find user by username
        AppUser user = appUserDao.findByUsernameIgnoreCase(changePasswordRequest.username())
                .orElseThrow(() -> HttpRequestException.badRequest("Invalid username or code."));

        // Find reset code
        ResetPasswordCode resetCode = resetPasswordCodeDao.findById(user.getId())
                .orElseThrow(() -> HttpRequestException.badRequest("Invalid username or code."));

        // Validate code and expiration
        if (!resetCode.getCode().equalsIgnoreCase(changePasswordRequest.code()) || resetCode.getExpiresAt().isBefore(LocalDateTime.now().minusMinutes(10))) {
            throw HttpRequestException.badRequest("Invalid username or code.");
        }

        // Validate new passwords match
        if (!changePasswordRequest.newPassword().equals(changePasswordRequest.verifyNewPassword())) {
            throw HttpRequestException.badRequest("New passwords do not match.");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(changePasswordRequest.newPassword()));
        appUserDao.save(user);

        // Invalidate the used reset code
        resetPasswordCodeDao.delete(resetCode);

        // Send confirmation email
        try {
            mailService.sendEmail(SendMailRequest.builder()
                    .to(user.getUsername())
                    .from(cryptoAppProperties.getServiceEmail())
                    .subject("Password Changed Successfully")
                    .text("<p>Your password has been changed successfully. If you did not change your password, your email may be compromised.</p>")
                    .build());
        } catch (Exception e) {
            // Log the error but do not interrupt the flow
            System.err.println("Failed to send password change confirmation email: " + e.getMessage());
        }

        // Note: Do not log the user in automatically after password change for security reasons.
    }

    /**
     * Initiate the forgot password process by generating a reset code and emailing it to the user.
     *
     * @param username the username (email) of the user who forgot their password
     */
    public void forgotPassword(String username) {
        Optional<AppUser> userOpt = appUserDao.findByUsernameIgnoreCase(username);

        if (userOpt.isPresent()) {
            AppUser user = userOpt.get();
            // Create reset password code
            ResetPasswordCode resetPasswordCode = resetPasswordCodeDao.findById(user.getId())
                    .orElse(ResetPasswordCode.builder()
                            .user(user)
                            .build());
            // Create code and set expiration
            resetPasswordCode.setCode(generateRandomCode(6));
            resetPasswordCode.setExpiresAt(LocalDateTime.now().plusMinutes(10));

            // Save
            resetPasswordCodeDao.save(resetPasswordCode);

            // Send Email
            mailService.sendEmail(SendMailRequest.builder()
                    .to(user.getUsername())
                    .subject("Password Reset Code")
                    .from(cryptoAppProperties.getServiceEmail())
                    .text(buildResetPasswordEmailText(resetPasswordCode.getCode(), user.getFirstName()))
                    .build());
        }
        // Always return 200 OK to prevent user enumeration
    }

    private String generateRandomCode(int length) {
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < length; i++) {
            char c = (char) ('A' + (int) (Math.random() * 26));
            code.append(c);
        }
        return code.toString();
    }

    private String buildResetPasswordEmailText(String code, String firstName) {
        return """
                <h1>Reset Password</h1>
                <p>Hi %s,</p>
                <p>You have requested to reset your password for your account at Crypto App.</p>
                <p>Your password reset code is:</p>
                <h2>%s</h2>
                <p>This code will expire in 10 minutes. If you did not request a password reset, please ignore this email.</p>
                <p>Thank you,<br/>The Crypto App Team</p>
                """.formatted(firstName, code);
    }

    public void deleteAccount(AppUser user) {
        if (user == null) {
            throw HttpRequestException.badRequest("User cannot be null.");
        }
        if (!appUserDao.existsById(user.getId())) {
            throw HttpRequestException.notFound("User not found.");
        }
        appUserDao.delete(user);
    }
}