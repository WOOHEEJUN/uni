package com.example.location_app.service.impl;

import com.example.location_app.exception.FileStorageException;
import com.example.location_app.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public String storeFile(MultipartFile file, String directory) {
        try {
            String fileName = StringUtils.cleanPath(file.getOriginalFilename());
            String fileExtension = fileName.substring(fileName.lastIndexOf("."));
            String newFileName = UUID.randomUUID().toString() + fileExtension;

            Path uploadPath = Paths.get(uploadDir + "/" + directory).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            Path targetLocation = uploadPath.resolve(newFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return newFileName;
        } catch (IOException ex) {
            throw new FileStorageException("Could not store file. Please try again!", ex);
        }
    }

    @Override
    public void deleteFile(String fileName, String directory) {
        try {
            Path filePath = getFilePath(fileName, directory);
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new FileStorageException("Could not delete file. Please try again!", ex);
        }
    }

    @Override
    public Path getFilePath(String fileName, String directory) {
        return Paths.get(uploadDir + "/" + directory).resolve(fileName).normalize();
    }
} 