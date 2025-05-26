package com.example.location_app.service;

import org.springframework.stereotype.Service;
import com.example.location_app.dto.ChatMessage;

@Service
public class ChatServiceImpl implements ChatService {
    
    @Override
    public void saveMessage(ChatMessage chatMessage) {
        // 메시지 저장 로직 구현
    }

    @Override
    public void sendMessage(String message) {
        // 메시지 전송 로직 구현
    }

    @Override
    public void handleMessage(String message) {
        // 메시지 처리 로직 구현
    }
} 