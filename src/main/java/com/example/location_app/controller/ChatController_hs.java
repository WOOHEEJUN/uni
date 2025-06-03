package com.example.location_app.controller;

import java.time.LocalDateTime;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.example.location_app.entity.ChatMessage_hs;
import com.example.location_app.repository.ChatMessageRepository_hs;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class ChatController_hs {

    private final ChatMessageRepository_hs chatMessageRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat/{buildingId}")
    public void sendMessage(@DestinationVariable String buildingId,
                            @Payload ChatMessage_hs message) {

        message.setTimestamp(LocalDateTime.now());
        message.setBuildingId(buildingId);

        ChatMessage_hs saved = chatMessageRepository.save(message);

        // 클라이언트 구독 주소로 메시지 브로드캐스트
        messagingTemplate.convertAndSend("/topic/" + buildingId, saved);
    }
}
