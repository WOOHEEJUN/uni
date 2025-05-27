package com.example.location_app.service;

import com.example.location_app.dto.SignUpRequest;
import com.example.location_app.entity.University;
import com.example.location_app.entity.User;
import com.example.location_app.entity.UserRole;
import com.example.location_app.entity.VerificationStatus;
import com.example.location_app.repository.UniversityRepository;
import com.example.location_app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final UniversityRepository universityRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void signUp(SignUpRequest request) {
        // 아이디 중복 검사
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("이미 사용 중인 아이디입니다.");
        }

        // 닉네임 중복 검사
        if (userRepository.existsByNickname(request.getNickname())) {
            throw new RuntimeException("이미 사용 중인 닉네임입니다.");
        }

        // 대학교 존재 여부 확인
        University university = universityRepository.findById(request.getUniversityId())
            .orElseThrow(() -> new RuntimeException("존재하지 않는 대학교입니다."));

        // 사용자 생성
        User user = User.builder()
            .username(request.getUsername())
            .password(passwordEncoder.encode(request.getPassword()))
            .nickname(request.getNickname())
            .university(university)
            .role(UserRole.USER)
            .status(VerificationStatus.PENDING)
            .build();

        userRepository.save(user);
    }
} 