package com.example.location_app.dto;

import lombok.Data;

@Data
public class ChatMessage {
    private String content;
    private String sender;
    private String receiver;
} 