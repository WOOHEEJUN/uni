package com.example.location_app.controller;

import com.example.location_app.service.DocumentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {
    private final DocumentService documentService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadDocument(@RequestParam("file") MultipartFile file) {
        try {
            // 현재 인증된 사용자 정보 가져오기
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                log.error("User is not authenticated");
                return ResponseEntity.status(401).body("로그인이 필요합니다.");
            }

            String username = authentication.getName();
            log.info("Received file upload request from user: {}", username);
            log.info("File details - Name: {}, Size: {}, Content Type: {}", 
                file.getOriginalFilename(), file.getSize(), file.getContentType());

            if (file.isEmpty()) {
                log.warn("Empty file received from user: {}", username);
                return ResponseEntity.badRequest().body("파일이 비어있습니다.");
            }

            documentService.uploadDocument(username, file);
            return ResponseEntity.ok("문서가 성공적으로 업로드되었습니다.");
        } catch (IllegalArgumentException e) {
            log.warn("Invalid file upload attempt: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Error during file upload: ", e);
            return ResponseEntity.internalServerError().body("문서 업로드 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
} 