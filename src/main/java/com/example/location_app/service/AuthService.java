package com.example.location_app.service;

import com.example.location_app.dto.LoginRequest;
import com.example.location_app.dto.RegisterRequest;

public interface AuthService {
    String register(RegisterRequest request);
    String login(LoginRequest request);
} 