package com.example.location_app.controller;

import com.example.location_app.entity.Board;
import com.example.location_app.entity.User;
import com.example.location_app.service.BoardService;
import com.example.location_app.service.UserService;
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
    private final UserService userService;

    @GetMapping("/university/{universityId}")
    public ResponseEntity<List<Board>> getBoardsByUniversity(@PathVariable Long universityId) {
        log.info("대학교 ID로 게시판 조회: {}", universityId);
        try {
            List<Board> boards = boardService.getBoardsByUniversityId(universityId);
            log.info("조회된 게시판 수: {}", boards.size());
            return ResponseEntity.ok(boards);
        } catch (Exception e) {
            log.error("게시판 조회 중 오류 발생: ", e);
            throw e;
        }
    }

    @GetMapping("/my-university")
    public ResponseEntity<?> getMyUniversityBoards(@AuthenticationPrincipal UserDetails userDetails) {
        log.info("현재 사용자의 대학교 게시판 조회 시도");
        
        if (userDetails == null) {
            log.error("인증되지 않은 사용자");
            return ResponseEntity.status(401).body("인증이 필요합니다.");
        }

        try {
            User user = userService.getUserByUsername(userDetails.getUsername());
            if (user == null) {
                log.error("사용자를 찾을 수 없음: {}", userDetails.getUsername());
                return ResponseEntity.status(404).body("사용자를 찾을 수 없습니다.");
            }

            if (user.getUniversity() == null) {
                log.error("사용자의 대학교 정보가 없음: {}", user.getUsername());
                return ResponseEntity.status(400).body("대학교 정보가 없습니다.");
            }

            List<Board> boards = boardService.getBoardsByUniversity(user.getUniversity());
            log.info("조회된 게시판 수: {}", boards.size());
            return ResponseEntity.ok(boards);
        } catch (Exception e) {
            log.error("게시판 조회 중 오류 발생: ", e);
            return ResponseEntity.status(500).body("서버 오류가 발생했습니다.");
        }
    }

    @GetMapping("/{boardId}")
    public ResponseEntity<Board> getBoard(@PathVariable Long boardId) {
        log.info("게시판 상세 조회: {}", boardId);
        try {
            Board board = boardService.getBoardById(boardId);
            return ResponseEntity.ok(board);
        } catch (Exception e) {
            log.error("게시판 상세 조회 중 오류 발생: ", e);
            throw e;
        }
    }
} 