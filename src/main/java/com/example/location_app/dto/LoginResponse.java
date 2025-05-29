package com.example.location_app.dto;

import com.example.location_app.entity.UserRole;
import com.example.location_app.entity.VerificationStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {
    private String token;
    private String username;
    private String nickname;
    private UserRole role;
    private VerificationStatus status;
    private String redirectUrl;
} 