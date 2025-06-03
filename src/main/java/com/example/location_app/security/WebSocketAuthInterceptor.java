package com.example.location_app.security;

import com.example.location_app.security.JwtTokenProvider;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        if ("CONNECT".equals(accessor.getCommand().name())) {
            String token = accessor.getFirstNativeHeader("Authorization");
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7); // "Bearer " 제거

                if (!jwtTokenProvider.validateToken(token)) {
                    throw new IllegalArgumentException("❌ WebSocket: 유효하지 않은 토큰입니다.");
                }

                // (선택) 인증 사용자 정보 설정
                Claims claims = jwtTokenProvider.getClaims(token);
                accessor.setUser(() -> claims.getSubject()); // 사용자 ID 또는 email 등
            } else {
                throw new IllegalArgumentException("❌ WebSocket: Authorization 헤더 누락");
            }
        }

        return message;
    }
}