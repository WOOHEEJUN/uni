package com.example.location_app.service;

import com.example.location_app.dto.UserDto;
import com.example.location_app.model.User;

public interface UserService {
    UserDto register(UserDto userDto);
    UserDto findByUsername(String username);
    UserDto updateUser(Long id, UserDto userDto);
    void updateLocation(Long userId, Double latitude, Double longitude);
    void updateStatus(Long userId, String status);
    void toggleLocationSharing(Long userId, boolean enabled);
} 