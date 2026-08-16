package com.banking.payment.controller;

import com.banking.payment.dto.TransferRequest;
import com.banking.payment.dto.TransferResponse;
import com.banking.payment.service.TransferService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transfers")
@RequiredArgsConstructor
public class TransferController {

    private final TransferService transferService;

    @PostMapping
    public ResponseEntity<TransferResponse> initiateTransfer(@RequestBody TransferRequest request) {
        return ResponseEntity.ok(transferService.initiateTransfer(request));
    }
}