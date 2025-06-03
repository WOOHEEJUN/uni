// 1. STOMP 설정 파일 (WebSocketStompConfig_hs.java)
package com.example.location_app.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketStompConfig_hs implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic"); // /topic/{buildingId} 형식으로 사용
        config.setApplicationDestinationPrefixes("/app"); // 클라이언트 메시지 전송 prefix
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws/chat") // WebSocket 접속 엔드포인트
                .setAllowedOriginPatterns("*") // 모든 Origin 허용
                .withSockJS(); // SockJS fallback 활성화
    }
}
