package com.example.location_app.config;

import com.example.location_app.entity.User;
import com.example.location_app.entity.UserRole;
import com.example.location_app.entity.VerificationStatus;
import com.example.location_app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // 관리자 계정이 없으면 생성
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin"))
                .nickname("관리자")
                .role(UserRole.ADMIN)
                .status(VerificationStatus.APPROVED)
                .build();
            
            userRepository.save(admin);
        }
    }
} 