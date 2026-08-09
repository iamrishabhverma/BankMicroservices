package com.banking.transaction.event;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TransactionEvent {
    private Long transactionId;
    private String accountId;
    private BigDecimal amount;
    private String type;
    private String status;
    private LocalDateTime timestamp;
}