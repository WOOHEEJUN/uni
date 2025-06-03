package com.example.location_app.repository;

import com.example.location_app.entity.Board;
import com.example.location_app.entity.University;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {
    List<Board> findByUniversity(University university);
    List<Board> findByUniversityId(Long universityId);
} 