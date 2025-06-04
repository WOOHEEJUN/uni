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

    @MessageMapping("/chat/{roomId}")
    public void sendMessage(@DestinationVariable String roomId,
                            @Payload ChatMessage_hs message) {

        message.setTimestamp(LocalDateTime.now());
        message.setBuildingId(roomId);

        if ("anonymous".equals(roomId)) {
            // 익명 채팅은 DB 저장 없이 브로드캐스트
            messagingTemplate.convertAndSend("/topic/anonymous", message);
        } else {
            ChatMessage_hs saved = chatMessageRepository.save(message);
            messagingTemplate.convertAndSend("/topic/" + roomId, saved);
        }
    }
}