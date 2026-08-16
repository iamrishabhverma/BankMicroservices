package com.banking.payment.repository;

import com.banking.payment.entity.Transfer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TransferRepository extends JpaRepository<Transfer, Long> {
    Optional<Transfer> findByTransferReference(String transferReference);
}