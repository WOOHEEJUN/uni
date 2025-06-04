package com.example.location_app.repository;

import com.example.location_app.entity.Post;
import com.example.location_app.entity.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findByBoard(Board board, Pageable pageable);
    Page<Post> findByBoardId(Long boardId, Pageable pageable);
    List<Post> findByBoardIdOrderByCreatedAtDesc(Long boardId);

    @Query(value = "SELECT p.* FROM posts p " +
            "JOIN boards b ON p.board_id = b.id " +
            "JOIN universities u ON b.university_id = u.id " +
            "WHERE u.id = :universityId " +
            "ORDER BY (p.view_count + p.like_count) DESC " +
            "LIMIT 4", nativeQuery = true)
    List<Post> findTop4ByBoardUniversityIdOrderByViewCountPlusLikeCountDesc(@Param("universityId") Integer universityId);
} 