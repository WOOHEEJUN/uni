package com.example.location_app.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api")
public class MainController {
    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }
} 