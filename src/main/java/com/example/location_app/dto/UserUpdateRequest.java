package com.example.location_app.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserUpdateRequest {
    @NotBlank(message = "현재 비밀번호는 필수 입력값입니다")
    private String currentPassword;
    
    private String newPassword;
    
    @NotBlank(message = "닉네임은 필수 입력값입니다")
    private String nickname;
} 