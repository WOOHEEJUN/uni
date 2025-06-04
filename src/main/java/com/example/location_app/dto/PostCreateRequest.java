package com.example.location_app.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostCreateRequest {
    private Long boardId;
    private String title;
    private String content;
    private boolean isAnonymous;
} 