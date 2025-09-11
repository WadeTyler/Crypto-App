package net.tylerwade.cryptoapp.mail;

import lombok.*;

@Getter @Setter @NoArgsConstructor
@AllArgsConstructor
@Builder
public class SendMailRequest {
    private String to;
    private String from;
    private String subject;
    private String text; // Html content
}