package com.example.location_app.dto;

import com.example.location_app.entity.Post;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PostResponse {
    private Long id;
    private String title;
    private String content;
    private boolean anonymous;
    private Integer viewCount;
    private Integer likeCount;
    private String authorName;
    private String boardType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer authorId;

    public static PostResponse from(Post post) {
        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setTitle(post.getTitle());
        response.setContent(post.getContent());
        response.setAnonymous(post.isAnonymous());
        response.setViewCount(post.getViewCount());
        response.setLikeCount(post.getLikeCount());
        response.setBoardType(post.getBoard().getType().name());
        response.setAuthorName(post.isAnonymous() || post.getBoard().getType().name().equals("ANONYMOUS") ? "익명" : post.getUser().getNickname());
        response.setCreatedAt(post.getCreatedAt());
        response.setUpdatedAt(post.getUpdatedAt());
        response.setAuthorId(post.getUser().getId());
        return response;
    }
} 