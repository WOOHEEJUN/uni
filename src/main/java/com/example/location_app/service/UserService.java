package com.example.location_app.service;

import com.example.location_app.dto.UserResponse;
import com.example.location_app.dto.UserUpdateRequest;
import com.example.location_app.entity.User;
import com.example.location_app.entity.VerificationStatus;
import com.example.location_app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + username));
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
            
        return UserResponse.builder()
            .id(user.getId())
            .username(user.getUsername())
            .nickname(user.getNickname())
            .universityId(user.getUniversity() != null ? user.getUniversity().getId() : null)
            .universityName(user.getUniversity() != null ? user.getUniversity().getName() : null)
            .status(user.getStatus())
            .role(user.getRole())
            .build();
    }

    @Transactional(readOnly = true)
    public User getCurrentUserEntity() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
    }

    @Transactional
    public void updateUserStatus(VerificationStatus status) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        user.setStatus(status);
        userRepository.save(user);
    }

    @Transactional
    public UserResponse updateUser(UserUpdateRequest request) {
        User user = getCurrentUserEntity();
        
        // 현재 비밀번호 확인
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("현재 비밀번호가 일치하지 않습니다.");
        }
        
        // 닉네임 중복 검사
        if (!user.getNickname().equals(request.getNickname()) && 
            userRepository.existsByNickname(request.getNickname())) {
            throw new RuntimeException("이미 사용 중인 닉네임입니다.");
        }
        
        // 정보 업데이트
        user.setNickname(request.getNickname());
        if (request.getNewPassword() != null && !request.getNewPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }
        
        return UserResponse.from(userRepository.save(user));
    }
} 