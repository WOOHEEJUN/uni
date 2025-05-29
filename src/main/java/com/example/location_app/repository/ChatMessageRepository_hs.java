// === ChatMessageRepository_hs.java ===
package com.example.location_app.repository;

import com.example.location_app.entity.ChatMessage_hs;
import org.springframework.data.jpa.repository.JpaRepository;

// 채팅 메시지를 DB에 저장하는 JPA 인터페이스
public interface ChatMessageRepository_hs extends JpaRepository<ChatMessage_hs, Long> {
}