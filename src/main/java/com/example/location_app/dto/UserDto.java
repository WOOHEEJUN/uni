package com.example.location_app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private Long id;
    private String username;
    private String password;
    private String nickname;
    private String email;
    private String phoneNumber;
    private String profileImageUrl;
    private String status;
    private boolean locationSharingEnabled;
    private Double latitude;
    private Double longitude;
} 