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

    /**
     * STOMP 메시지를 받아서 저장하고 해당 건물 채팅방에 브로드캐스트.
     * @param roomId university_buildingId 조합 (예: "snu_101")
     * @param message 클라이언트가 보낸 메시지
     */
    @MessageMapping("/chat/{roomId}")
    public void sendMessage(@DestinationVariable String roomId,
                            @Payload ChatMessage_hs message) {

        message.setTimestamp(LocalDateTime.now());
        message.setBuildingId(roomId); // 여기서는 실제로는 roomId (university_buildingId)

        ChatMessage_hs saved = chatMessageRepository.save(message);

        // 해당 채팅방 구독자에게 메시지 브로드캐스트
        messagingTemplate.convertAndSend("/topic/" + roomId, saved);
    }
}