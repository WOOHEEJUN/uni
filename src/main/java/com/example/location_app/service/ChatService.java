package com.example.location_app.service;

import com.example.location_app.dto.ChatMessage;

public interface ChatService {
    void saveMessage(ChatMessage chatMessage);
    void sendMessage(String message);
    void handleMessage(String message);
} 