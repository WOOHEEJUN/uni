package com.example.location_app.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
@Data
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String content;
    private Long senderId;
    private Long receiverId;
    private boolean isRead;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
} 