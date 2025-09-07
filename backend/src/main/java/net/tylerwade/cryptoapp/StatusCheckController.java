package net.tylerwade.cryptoapp;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StatusCheckController {

    @GetMapping("/status")
    public String status() {
        return "OK";
    }
}