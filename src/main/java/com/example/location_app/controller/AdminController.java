package com.example.location_app.controller;

import com.example.location_app.dto.UserStatusUpdateRequest;
import com.example.location_app.entity.VerificationStatus;
import com.example.location_app.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final String UPLOAD_DIR = "uploads";

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{userId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserStatus(
            @PathVariable Integer userId,
            @Valid @RequestBody UserStatusUpdateRequest request) {
        adminService.updateUserStatus(userId, request.getStatus());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/uploads/{userId}/certificate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> getCertificateImage(@PathVariable Integer userId) {
        try {
            Path userDir = Paths.get(UPLOAD_DIR, userId.toString());
            if (!Files.exists(userDir)) {
                return ResponseEntity.notFound().build();
            }

            // 디렉토리에서 첫 번째 .jpg 파일을 찾습니다
            Optional<Path> certificatePath = Files.list(userDir)
                    .filter(path -> path.toString().toLowerCase().endsWith(".jpg"))
                    .findFirst();

            if (certificatePath.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = new UrlResource(certificatePath.get().toUri());
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(resource);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }
} 