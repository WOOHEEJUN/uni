package com.example.location_app.repository;

import com.example.location_app.entity.UserDocument;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserDocumentRepository extends JpaRepository<UserDocument, Integer> {
} 