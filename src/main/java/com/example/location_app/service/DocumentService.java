package com.example.location_app.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.location_app.entity.User;
import com.example.location_app.entity.UserDocument;
import com.example.location_app.repository.UserDocumentRepository;
import com.example.location_app.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class DocumentService { //증명서 제출
    private final UserDocumentRepository userDocumentRepository;
    private final UserRepository userRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Transactional
    public void uploadDocument(String username, MultipartFile file) throws IOException {
        log.info("Starting document upload for user: {}", username);
        log.info("Upload directory: {}", uploadDir);
        log.info("File details - Name: {}, Size: {}, Content Type: {}", 
            file.getOriginalFilename(), file.getSize(), file.getContentType());

        // 파일 확장자 검사
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new IllegalArgumentException("파일 이름이 없습니다.");
        }
        
        String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
        log.info("File extension: {}", extension);
        
        if (!extension.matches("jpg|jpeg|png|pdf")) {
            throw new IllegalArgumentException("JPG, JPEG, PNG, PDF 파일만 업로드 가능합니다.");
        }

        // 사용자 조회
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        log.info("User found: {}", user.getUsername());

        // upload 폴더 생성
        Path uploadsDir = Paths.get("upload");
        if (!Files.exists(uploadsDir)) {
            log.info("Creating upload directory at: {}", uploadsDir);
            Files.createDirectories(uploadsDir);
        }

        // 사용자 ID로 디렉토리 생성
        String userId = user.getId().toString();
        Path userDir = uploadsDir.resolve(userId);
        if (!Files.exists(userDir)) {
            log.info("Creating user directory at: {}", userDir);
            Files.createDirectories(userDir);
        }

        // 파일 저장
        String fileName = UUID.randomUUID().toString() + "." + extension;
        Path filePath = userDir.resolve(fileName);
        log.info("Attempting to save file at: {}", filePath);
        
        try {
            Files.copy(file.getInputStream(), filePath);
            log.info("File saved successfully at: {}", filePath);

            // DB에 문서 정보 저장 (상대 경로 저장)
            String relativePath = "upload/" + userId + "/" + fileName;
            UserDocument document = UserDocument.builder()
                .user(user)
                .imagePath(relativePath)
                .build();

            userDocumentRepository.save(document);
            log.info("Document information saved to database for user: {}", username);
        } catch (IOException e) {
            log.error("Error during file upload: ", e);
            throw new IOException("파일 저장 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
} 