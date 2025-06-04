package com.example.location_app.repository;

import com.example.location_app.entity.Board;
import com.example.location_app.entity.BoardType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {
    List<Board> findByUniversityId(Long universityId);
    Optional<Board> findByUniversityIdAndType(Long universityId, BoardType type);
} 