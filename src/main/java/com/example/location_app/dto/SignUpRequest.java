package com.example.location_app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SignUpRequest {
    
    @NotBlank(message = "아이디는 필수 입력값입니다")
    private String username;
    
    @NotNull(message = "대학교는 필수 선택값입니다")
    private Integer universityId;
    
    @NotBlank(message = "비밀번호는 필수 입력값입니다")
    private String password;
    
    @NotBlank(message = "닉네임은 필수 입력값입니다")
    private String nickname;
} 