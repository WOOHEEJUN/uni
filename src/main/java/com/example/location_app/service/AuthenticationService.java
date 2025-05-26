package com.example.location_app.service;

import com.example.location_app.dto.AuthenticationRequest;
import com.example.location_app.dto.AuthenticationResponse;
import com.example.location_app.dto.UserDto;

public interface AuthenticationService {
    AuthenticationResponse register(UserDto request);
    AuthenticationResponse authenticate(AuthenticationRequest request);
} 