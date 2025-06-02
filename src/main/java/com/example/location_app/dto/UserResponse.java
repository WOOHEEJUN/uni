package com.example.location_app.dto;

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
    private Integer university_id;
    private String universityName;
    private VerificationStatus status;
    private UserRole role;
} 