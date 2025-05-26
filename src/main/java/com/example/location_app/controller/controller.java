package com.example.location_app.controller;

@RestController
@RequestMapping("/api")
public class Controller {
    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }
}
