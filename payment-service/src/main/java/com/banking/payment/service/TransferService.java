package com.banking.payment.service;

import com.banking.payment.dto.TransferRequest;
import com.banking.payment.dto.TransferResponse;
import com.banking.payment.entity.Transfer;
import com.banking.payment.event.TransferEvent;
import com.banking.payment.repository.TransferRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransferService {

    private final TransferRepository transferRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public TransferResponse initiateTransfer(TransferRequest request) {
        String reference = UUID.randomUUID().toString();

        Transfer transfer = Transfer.builder()
                .transferReference(reference)
                .sourceAccountNumber(request.getSourceAccountNumber())
                .destinationAccountNumber(request.getDestinationAccountNumber())
                .amount(request.getAmount())
                .status("INITIATED")
                .build();

        Transfer savedTransfer = transferRepository.save(transfer);

        // Publish Transfer Event to Kafka
        TransferEvent event = TransferEvent.builder()
                .transferReference(savedTransfer.getTransferReference())
                .sourceAccountNumber(savedTransfer.getSourceAccountNumber())
                .destinationAccountNumber(savedTransfer.getDestinationAccountNumber())
                .amount(savedTransfer.getAmount())
                .status(savedTransfer.getStatus())
                .build();

        kafkaTemplate.send("transfer-events", savedTransfer.getTransferReference(), event);
        log.info("💸 Transfer Initiated and Event Published: {}", reference);

        return TransferResponse.builder()
                .transferReference(savedTransfer.getTransferReference())
                .sourceAccountNumber(savedTransfer.getSourceAccountNumber())
                .destinationAccountNumber(savedTransfer.getDestinationAccountNumber())
                .amount(savedTransfer.getAmount())
                .status(savedTransfer.getStatus())
                .createdAt(savedTransfer.getCreatedAt())
                .build();
    }
}