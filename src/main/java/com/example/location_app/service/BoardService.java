package com.example.location_app.service;

import com.example.location_app.entity.Board;
import com.example.location_app.entity.BoardType;
import com.example.location_app.entity.University;
import com.example.location_app.entity.User;
import com.example.location_app.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BoardService {
    private final BoardRepository boardRepository;
    private final UserService userService;

    @Transactional(readOnly = true)
    public List<Board> getBoardsByUniversity(University university) {
        log.info("대학교로 게시판 조회: {}", university.getName());
        List<Board> boards = boardRepository.findByUniversityId(university.getId().longValue());
        log.info("조회된 게시판 수: {}", boards.size());
        return boards;
    }

    @Transactional(readOnly = true)
    public List<Board> getBoardsByUniversityId(Long universityId) {
        log.info("대학교 ID로 게시판 조회: {}", universityId);
        List<Board> boards = boardRepository.findByUniversityId(universityId);
        log.info("조회된 게시판 수: {}", boards.size());
        return boards;
    }

    @Transactional(readOnly = true)
    public Board getBoardById(Long boardId) {
        log.info("게시판 ID로 조회: {}", boardId);
        return boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("게시판을 찾을 수 없습니다."));
    }

    @Transactional(readOnly = true)
    public Board getBoardByType(BoardType type) {
        User currentUser = userService.getCurrentUserEntity();
        return boardRepository.findByUniversityIdAndType(
                currentUser.getUniversity().getId().longValue(), 
                type
        ).orElseThrow(() -> new RuntimeException("게시판을 찾을 수 없습니다."));
    }

    @Transactional(readOnly = true)
    public List<Board> getMyUniversityBoards() {
        User currentUser = userService.getCurrentUserEntity();
        return boardRepository.findByUniversityId(
                currentUser.getUniversity().getId().longValue()
        );
    }
} 