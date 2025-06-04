package com.example.location_app.repository;

import com.example.location_app.entity.Post;
import com.example.location_app.entity.PostLike;
import com.example.location_app.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    boolean existsByPostAndUser(Post post, User user);
    void deleteByPostAndUser(Post post, User user);
} 