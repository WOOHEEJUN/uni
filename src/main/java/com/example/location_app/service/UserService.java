package com.example.location_app.service;

import com.example.location_app.dto.UserResponse;
import com.example.location_app.entity.User;
import com.example.location_app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
            
        return UserResponse.builder()
            .id(user.getId())
            .username(user.getUsername())
            .nickname(user.getNickname())
            .university_id(user.getUniversity() != null ? user.getUniversity().getId() : null)
            .universityName(user.getUniversity() != null ? user.getUniversity().getName() : null)
            .status(user.getStatus())
            .role(user.getRole())
            .build();
    }
} 