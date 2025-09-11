package net.tylerwade.cryptoapp.mail;

import io.awspring.cloud.sqs.operations.SqsTemplate;
import lombok.RequiredArgsConstructor;
import net.tylerwade.cryptoapp.config.CryptoAppProperties;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailService {

    private final CryptoAppProperties cryptoAppProperties;
    private final SqsTemplate sqsTemplate;

    public void sendEmail(SendMailRequest sendMailRequest) {
        sqsTemplate.send(cryptoAppProperties.getMailQueueUrl(), sendMailRequest);
    }
}