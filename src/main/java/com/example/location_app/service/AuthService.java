package com.example.location_app.service;

import com.example.location_app.dto.LoginRequest;
import com.example.location_app.dto.LoginResponse;
import com.example.location_app.dto.SignUpRequest;
import com.example.location_app.entity.University;
import com.example.location_app.entity.User;
import com.example.location_app.entity.UserRole;
import com.example.location_app.entity.VerificationStatus;
import com.example.location_app.repository.UniversityRepository;
import com.example.location_app.repository.UserRepository;
import com.example.location_app.security.JwtTokenProvider;
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
    private final JwtTokenProvider jwtTokenProvider;

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

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        // 사용자 조회
        User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new RuntimeException("존재하지 않는 사용자입니다."));

        // 비밀번호 검증
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        // 계정 상태 확인
        if (user.getStatus() == VerificationStatus.PENDING) {
            throw new RuntimeException("승인 대기 중인 계정입니다.");
        } else if (user.getStatus() == VerificationStatus.REJECTED) {
            throw new RuntimeException("승인 거절된 계정입니다.");
        }

        // JWT 토큰 생성
        String token = jwtTokenProvider.createToken(user.getUsername(), user.getRole());

        // 응답 데이터 생성
        return LoginResponse.builder()
            .token(token)
            .username(user.getUsername())
            .nickname(user.getNickname())
            .role(user.getRole())
            .redirectUrl(user.getRole() == UserRole.ADMIN ? "/admin" : "/")
            .build();
    }
} 