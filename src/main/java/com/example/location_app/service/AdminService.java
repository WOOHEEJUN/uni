package com.example.location_app.service;

import com.example.location_app.dto.UserResponse;
import com.example.location_app.entity.User;
import com.example.location_app.entity.VerificationStatus;
import com.example.location_app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        
        return userRepository.findAll().stream()
            .filter(user -> !user.getUsername().equals(currentUsername))
            .map(this::convertToUserResponse)
            .collect(Collectors.toList());
    }

    @Transactional
    public void updateUserStatus(Integer userId, VerificationStatus status) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("존재하지 않는 사용자입니다."));
        
        user.setStatus(status);
        userRepository.save(user);
    }

    private UserResponse convertToUserResponse(User user) {
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
} 