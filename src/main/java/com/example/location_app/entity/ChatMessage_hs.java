// === ChatMessage_hs.java ===
package com.example.location_app.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

// DB에 저장될 채팅 메시지 엔티티
@Entity
@Table(name = "chat_messages")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ChatMessage_hs {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String sender; // 사용자 닉네임

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message; // 메시지 본문

    @Column(name = "sent_at")
    private LocalDateTime sentAt = LocalDateTime.now();
}