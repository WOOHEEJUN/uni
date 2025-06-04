package com.example.location_app.dto;

import com.example.location_app.entity.User;
import com.example.location_app.entity.UserRole;
import com.example.location_app.entity.VerificationStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
    private Integer id;
    private String username;
    private String nickname;
    private String universityName;
    private VerificationStatus status;
    private UserRole role;
    private Integer universityId;

    public static UserResponse from(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .nickname(user.getNickname())
                .universityName(user.getUniversity() != null ? user.getUniversity().getName() : null)
                .universityId(user.getUniversity() != null ? user.getUniversity().getId() : null)
                .status(user.getStatus())
                .role(user.getRole())
                .build();
    }
} 