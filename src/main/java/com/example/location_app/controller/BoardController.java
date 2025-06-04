package com.example.location_app.controller;

import com.example.location_app.entity.Board;
import com.example.location_app.entity.BoardType;
import com.example.location_app.service.BoardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
public class BoardController {
    private final BoardService boardService;

    @GetMapping("/type/{type}")
    public ResponseEntity<Board> getBoardByType(@PathVariable BoardType type) {
        log.info("게시판 타입으로 조회: {}", type);
        return ResponseEntity.ok(boardService.getBoardByType(type));
    }

    @GetMapping("/my-university")
    public ResponseEntity<List<Board>> getMyUniversityBoards(@AuthenticationPrincipal UserDetails userDetails) {
        log.info("내 대학교 게시판 목록 조회");
        return ResponseEntity.ok(boardService.getMyUniversityBoards());
    }
} 