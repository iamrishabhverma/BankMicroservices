package com.banking.transaction.service;

import com.banking.transaction.dto.TransactionRequest;
import com.banking.transaction.dto.TransactionResponse;
import com.banking.transaction.entity.Transaction;
import com.banking.transaction.event.TransactionEvent;
import com.banking.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${app.kafka.topic.transaction-events}")
    private String transactionTopic;

    public TransactionResponse processTransaction(TransactionRequest request) {
        Transaction transaction = Transaction.builder()
                .accountId(request.getAccountId())
                .amount(request.getAmount())
                .type(request.getType())
                .status(Transaction.TransactionStatus.COMPLETED)
                .description(request.getDescription())
                .timestamp(LocalDateTime.now())
                .build();

        Transaction savedTransaction = transactionRepository.save(transaction);

        // Emit Kafka event asynchronously to downstream services (Notification, Fraud)
        TransactionEvent event = TransactionEvent.builder()
                .transactionId(savedTransaction.getId())
                .accountId(savedTransaction.getAccountId())
                .amount(savedTransaction.getAmount())
                .type(savedTransaction.getType().name())
                .status(savedTransaction.getStatus().name())
                .timestamp(savedTransaction.getTimestamp())
                .build();

        kafkaTemplate.send(transactionTopic, savedTransaction.getAccountId(), event);

        return mapToResponse(savedTransaction);
    }

    public List<TransactionResponse> getTransactionsByAccount(String accountId) {
        return transactionRepository.findByAccountId(accountId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private TransactionResponse mapToResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .id(transaction.getId())
                .accountId(transaction.getAccountId())
                .amount(transaction.getAmount())
                .type(transaction.getType())
                .status(transaction.getStatus())
                .description(transaction.getDescription())
                .timestamp(transaction.getTimestamp())
                .build();
    }
}