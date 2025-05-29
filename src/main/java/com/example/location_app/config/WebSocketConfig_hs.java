// === WebSocketConfig_hs.java ===
package com.example.location_app.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import com.example.location_app.WebSocket.ChatHandler_hs;
import lombok.RequiredArgsConstructor;

// WebSocket을 활성화하고 핸들러를 등록하는 설정 클래스
@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig_hs implements WebSocketConfigurer {

    private final ChatHandler_hs chatHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(chatHandler, "/ws/chat").setAllowedOrigins("*");
    }
}