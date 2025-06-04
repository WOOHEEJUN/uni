package com.example.location_app.security;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        if ("CONNECT".equals(accessor.getCommand().name())) {
            String token = accessor.getFirstNativeHeader("Authorization");

            //  Authorization 헤더가 없으면 익명 채팅방으로 간주
            if (token == null || token.isBlank()) {
                return message; // 익명 사용자 허용
            }

            if (token.startsWith("Bearer ")) {
                token = token.substring(7); // "Bearer " 제거
                if (!jwtTokenProvider.validateToken(token)) {
                    throw new IllegalArgumentException("❌ WebSocket: 유효하지 않은 토큰입니다.");
                }

                Claims claims = jwtTokenProvider.getClaims(token);
                accessor.setUser(() -> claims.getSubject()); // 사용자명 설정
            } else {
                throw new IllegalArgumentException("❌ WebSocket: Authorization 헤더 형식 오류");
            }
        }

        return message;
    }
}