package com.example.location_app.dto;

import com.example.location_app.entity.VerificationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserStatusUpdateRequest {
    @NotNull(message = "상태는 필수 입력값입니다")
    private VerificationStatus status;
} 