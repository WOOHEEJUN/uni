package com.example.location_app.controller;

import com.example.location_app.dto.UserResponse;
import com.example.location_app.dto.UserStatusUpdateRequest;
import com.example.location_app.dto.UserUpdateRequest;
import com.example.location_app.entity.VerificationStatus;
import com.example.location_app.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {
        return ResponseEntity.ok(userService.getCurrentUser());
    }

    @PutMapping("/status")
    public ResponseEntity<Void> updateUserStatus(@RequestBody UserStatusUpdateRequest request) {
        userService.updateUserStatus(request.getStatus());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update")
    public ResponseEntity<UserResponse> updateUser(@RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(userService.updateUser(request));
    }
} 