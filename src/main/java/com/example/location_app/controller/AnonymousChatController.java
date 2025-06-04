package com.example.location_app.controller;

import java.time.LocalDateTime;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.example.location_app.entity.AnonymousMessage;
import com.example.location_app.repository.AnonymousMessageRepository;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class AnonymousChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final AnonymousMessageRepository anonymousMessageRepository;

    @MessageMapping("/anonymous")
    public void sendAnonymousMessage(@Payload AnonymousMessage message) {
        message.setTimestamp(LocalDateTime.now());
        AnonymousMessage saved = anonymousMessageRepository.save(message);
        messagingTemplate.convertAndSend("/topic/anonymous", saved);
    }
}