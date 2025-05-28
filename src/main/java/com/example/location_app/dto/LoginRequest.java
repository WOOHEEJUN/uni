package com.example.location_app.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "아이디는 필수 입력값입니다")
    private String username;
    
    @NotBlank(message = "비밀번호는 필수 입력값입니다")
    private String password;
} 