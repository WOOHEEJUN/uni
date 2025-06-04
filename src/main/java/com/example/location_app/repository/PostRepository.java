package com.example.location_app.repository;

import com.example.location_app.entity.Post;
import com.example.location_app.entity.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findByBoard(Board board, Pageable pageable);
    Page<Post> findByBoardId(Long boardId, Pageable pageable);
    List<Post> findByBoardIdOrderByCreatedAtDesc(Long boardId);
} 