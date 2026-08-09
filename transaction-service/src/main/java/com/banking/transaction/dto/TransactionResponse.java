package com.banking.transaction.dto;

import com.banking.transaction.entity.Transaction.TransactionStatus;
import com.banking.transaction.entity.Transaction.TransactionType;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class TransactionResponse {
    private Long id;
    private String accountId;
    private BigDecimal amount;
    private TransactionType type;
    private TransactionStatus status;
    private String description;
    private LocalDateTime timestamp;
}