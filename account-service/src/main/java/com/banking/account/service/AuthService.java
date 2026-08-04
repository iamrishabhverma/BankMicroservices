package com.banking.account.service;

import com.banking.account.dto.*;
import com.banking.account.model.*;
import com.banking.account.repository.*;
import com.banking.account.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFirstName() + " " + request.getLastName())
                .build();

        user = userRepository.save(user);

        // Auto-create initial account with $1,000 balance
        Account account = Account.builder()
                .accountNumber("ACC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .balance(new BigDecimal("1000.00"))
                .user(user)
                .build();

        accountRepository.save(account);

        String token = jwtUtils.generateToken(user.getEmail());
        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .userId(user.getId())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtils.generateToken(user.getEmail());
        String[] names = user.getFullName() != null && user.getFullName().contains(" ") ? user.getFullName().split(" ", 2) : new String[]{user.getFullName(), ""};
        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .userId(user.getId())
                .firstName(names[0])
                .lastName(names.length > 1 ? names[1] : "")
                .build();
    }
}