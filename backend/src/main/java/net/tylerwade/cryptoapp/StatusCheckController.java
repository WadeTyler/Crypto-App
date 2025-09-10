package net.tylerwade.cryptoapp;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Simple health/status endpoint to verify the application is running.
 */
@RestController
public class StatusCheckController {

    /**
     * Returns constant OK string for liveness checks.
     * @return OK
     */
    @GetMapping("/status")
    public String status() {
        return "OK";
    }
}