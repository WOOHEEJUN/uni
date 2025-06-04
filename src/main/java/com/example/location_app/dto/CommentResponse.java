package com.example.location_app.dto;

import com.example.location_app.entity.Comment;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CommentResponse {
    private Long id;
    private String content;
    private boolean anonymous;
    private String authorName;
    private String boardType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CommentResponse from(Comment comment) {
        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setContent(comment.getContent());
        response.setAnonymous(comment.isAnonymous());
        response.setBoardType(comment.getPost().getBoard().getType().name());
        response.setAuthorName(comment.isAnonymous() || comment.getPost().getBoard().getType().name().equals("ANONYMOUS") ? "익명" : comment.getUser().getNickname());
        response.setCreatedAt(comment.getCreatedAt());
        response.setUpdatedAt(comment.getUpdatedAt());
        return response;
    }
} 