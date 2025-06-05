package com.example.location_app.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.example.location_app.entity.ChatMessage_hs;
import com.example.location_app.repository.ChatMessageRepository_hs;
import com.example.location_app.security.JwtTokenProvider;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class ChatController_hs {

    private final ChatMessageRepository_hs chatMessageRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final JwtTokenProvider jwtTokenProvider;

    private final ConcurrentHashMap<String, String> sessionNicknameMap = new ConcurrentHashMap<>();
    private final AtomicInteger anonymousCounter = new AtomicInteger(1);

    // 수정 가능한 금지어 리스트
    private static final List<String> bannedWords = new ArrayList<>(List.of(
        "바보", "멍청이", "병신", "씨발","존나","좆까","좆","애미","니미","개새끼","새끼","ㅆㅂ","ㅅㅂ","ㅈㄴ","ㅈㄲ","ㅂㅅ","ㅄ","ㄳㄲ","ㅅㄲ","ㄴㅇㅁ","ㅇㅁ"
    ));

    @MessageMapping("/chat/{roomId}")
    public void sendMessage(@DestinationVariable String roomId,
                            @Payload ChatMessage_hs message,
                            SimpMessageHeaderAccessor headerAccessor) {

        message.setTimestamp(LocalDateTime.now());
        message.setBuildingId(roomId);

        // 금지어 필터 적용
        message.setContent(filterBannedWords(message.getContent()));

        // 익명 채팅 처리
        if ("anonymous".equals(roomId)) {
            String sessionId = headerAccessor.getSessionId();
            String nickname = sessionNicknameMap.computeIfAbsent(sessionId, id -> "익명" + anonymousCounter.getAndIncrement());
            message.setSender(nickname);

            messagingTemplate.convertAndSend("/topic/anonymous", message);
            return;
        }

        // 건물 채팅방 토큰 확인
        String token = headerAccessor.getFirstNativeHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            Claims claims = jwtTokenProvider.getClaims(token);

            String userUni = String.valueOf(claims.get("universityName"));
            String expectedPrefix = userUni + "_";

            if (!roomId.startsWith(expectedPrefix)) {
                System.out.println("⚠️ 접근 거부: 타 대학 건물 채팅방 접속 시도");
                return;
            }
        }

        ChatMessage_hs saved = chatMessageRepository.save(message);
        messagingTemplate.convertAndSend("/topic/" + roomId, saved);
    }

    // 금지어 필터링 함수
    private String filterBannedWords(String content) {
        if (content == null) return null;

        String result = content;
        for (String word : bannedWords) {
            if (word != null && !word.isBlank()) {
                result = result.replaceAll("(?i)" + word, "***");
            }
        }
        return result;
    }
}
