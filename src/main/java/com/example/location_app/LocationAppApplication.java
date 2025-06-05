package com.example.location_app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class LocationAppApplication {
    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(LocationAppApplication.class);
        Environment env = app.run(args).getEnvironment();
        String port = env.getProperty("server.port", "8080");
        System.out.println("\n================================================");
        System.out.println("서버가 시작되었습니다. 다음 주소로 접속하세요:");
        System.out.println("http://localhost:" + port);
        System.out.println("================================================\n");
    }
} 