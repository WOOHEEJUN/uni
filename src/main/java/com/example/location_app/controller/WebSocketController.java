package com.example.location_app.controller;

import com.example.location_app.dto.ChatMessage;
import com.example.location_app.dto.LocationDto;
import com.example.location_app.dto.LocationUpdate;
import com.example.location_app.service.ChatService;
import com.example.location_app.service.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;
    private final LocationService locationService;

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessage chatMessage) {
        chatService.saveMessage(chatMessage);
        messagingTemplate.convertAndSendToUser(
                chatMessage.getReceiver(),
                "/queue/messages",
                chatMessage
        );
    }

    @MessageMapping("/chat.addUser")
    public void addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        messagingTemplate.convertAndSendToUser(
                chatMessage.getSender(),
                "/queue/messages",
                chatMessage
        );
    }

    @MessageMapping("/location.update")
    public void updateLocation(@Payload LocationUpdate locationUpdate) {
        LocationDto locationDto = new LocationDto();
        locationDto.setUserId(locationUpdate.getUserId().toString());
        locationDto.setLatitude(locationUpdate.getLatitude());
        locationDto.setLongitude(locationUpdate.getLongitude());
        
        locationService.updateLocation(locationDto);
        messagingTemplate.convertAndSend("/topic/locations", locationUpdate);
    }
} 