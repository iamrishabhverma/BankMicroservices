package com.banking.transaction.dto;

import com.banking.transaction.entity.Transaction.TransactionType;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class TransactionRequest {
    private String accountId;
    private BigDecimal amount;
    private TransactionType type;
    private String description;
}