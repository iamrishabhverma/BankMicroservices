package com.banking.payment.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transfers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transfer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String transferReference;

    @Column(nullable = false)
    private String sourceAccountNumber;

    @Column(nullable = false)
    private String destinationAccountNumber;

    @Column(nullable = false)
    private BigDecimal amount;

    @Builder.Default
    private String status = "INITIATED"; // INITIATED, COMPLETED, FAILED

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}