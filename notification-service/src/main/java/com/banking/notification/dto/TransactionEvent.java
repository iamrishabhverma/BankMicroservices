package com.banking.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionEvent {
    private String transactionId;
    private String accountNumber;
    private String transactionType; // DEPOSIT, WITHDRAWAL, TRANSFER
    private BigDecimal amount;
    private String status;         // SUCCESS, FAILED
    private LocalDateTime timestamp;
}