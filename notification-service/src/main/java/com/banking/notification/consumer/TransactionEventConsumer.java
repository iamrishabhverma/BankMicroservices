package com.banking.notification.consumer;

import com.banking.notification.dto.TransactionEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class TransactionEventConsumer {

    @KafkaListener(
            topics = "${spring.kafka.topic.transaction-events:transaction-events}",
            groupId = "notification-group"
    )
    public void consumeTransactionEvent(TransactionEvent event) {
        log.info("📩 [NOTIFICATION RECEIVED] Processing alert for Account: {}", event.getAccountNumber());
        log.info("Details: Type={}, Amount={}, Status={}, TxID={}",
                event.getTransactionType(),
                event.getAmount(),
                event.getStatus(),
                event.getTransactionId());

        // Simulate sending SMS / Email Notification
        sendNotification(event);
    }

    private void sendNotification(TransactionEvent event) {
        log.info("✉️ Notification sent to user for account {}: Your {} of ${} was {}.",
                event.getAccountNumber(),
                event.getTransactionType(),
                event.getAmount(),
                event.getStatus());
    }
}