// === ChatHandler_hs.java ===
package com.example.location_app.WebSocket;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.example.location_app.entity.ChatMessage_hs;
import com.example.location_app.entity.User;
import com.example.location_app.repository.ChatMessageRepository_hs;

import lombok.RequiredArgsConstructor;

// 실시간 채팅 메시지를 처리하는 WebSocket 핸들러
@Component
@RequiredArgsConstructor
public class ChatHandler_hs extends TextWebSocketHandler {

    private final ChatMessageRepository_hs chatMessageRepository;
    private final Set<WebSocketSession> sessions = Collections.synchronizedSet(new HashSet<>());

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String content = message.getPayload();

        // 인증된 사용자로부터 nickname 가져오기
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String sender;
        if (principal instanceof User) {
            User user = (User) principal;
            sender = user.getNickname();
        } else if (principal instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) principal;
            sender = userDetails.getUsername(); // fallback
        } else {
            sender = "익명"; // fallback
        }

        // DB 저장
        ChatMessage_hs saved = chatMessageRepository.save(new ChatMessage_hs(null, sender, content, LocalDateTime.now()));

        // 전체 사용자에게 메시지 전송
        for (WebSocketSession s : sessions) {
            if (s.isOpen()) {
                try {
                    s.sendMessage(new TextMessage(sender + ": " + content));
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session);
    }
}