package com.banking.payment.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class TransferRequest {
    private String sourceAccountNumber;
    private String destinationAccountNumber;
    private BigDecimal amount;
}