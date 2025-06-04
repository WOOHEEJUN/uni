package com.example.location_app.service;

import com.example.location_app.dto.PostCreateRequest;
import com.example.location_app.dto.PostResponse;
import com.example.location_app.dto.CommentCreateRequest;
import com.example.location_app.dto.CommentResponse;
import com.example.location_app.entity.Board;
import com.example.location_app.entity.Post;
import com.example.location_app.entity.User;
import com.example.location_app.entity.Comment;
import com.example.location_app.entity.PostLike;
import com.example.location_app.repository.BoardRepository;
import com.example.location_app.repository.PostRepository;
import com.example.location_app.repository.CommentRepository;
import com.example.location_app.repository.PostLikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final BoardRepository boardRepository;
    private final CommentRepository commentRepository;
    private final PostLikeRepository postLikeRepository;
    private final UserService userService;

    @Transactional(readOnly = true)
    public List<PostResponse> getPostsByBoard(Long boardId) {
        return postRepository.findByBoardIdOrderByCreatedAtDesc(boardId).stream()
                .map(PostResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public PostResponse getPost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        
        // 조회수 증가
        post.setViewCount(post.getViewCount() + 1);
        postRepository.save(post);
        
        return PostResponse.from(post);
    }

    @Transactional
    public PostResponse createPost(PostCreateRequest request, String username) {
        User user = userService.getUserByUsername(username);
        Board board = boardRepository.findById(request.getBoardId())
                .orElseThrow(() -> new RuntimeException("게시판을 찾을 수 없습니다."));

        Post post = new Post();
        post.setBoard(board);
        post.setUser(user);
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setAnonymous(request.isAnonymous());
        post.setViewCount(0);
        post.setLikeCount(0);

        return PostResponse.from(postRepository.save(post));
    }

    @Transactional
    public void deletePost(Long postId, String username) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        
        User currentUser = userService.getUserByUsername(username);
        if (!post.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("게시글은 작성자만 삭제할 수 있습니다.");
        }

        // 게시글의 댓글들을 먼저 삭제
        commentRepository.deleteByPostId(postId);
        
        // 그 다음 게시글 삭제
        postRepository.delete(post);
    }

    @Transactional
    public CommentResponse createComment(Long postId, CommentCreateRequest request, String username) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        
        User user = userService.getUserByUsername(username);

        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUser(user);
        comment.setContent(request.getContent());
        comment.setAnonymous(request.isAnonymous());

        return CommentResponse.from(commentRepository.save(comment));
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getComments(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtDesc(postId).stream()
                .map(CommentResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getLikeStatus(Long postId, String username) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        
        User user = userService.getUserByUsername(username);
        boolean isLiked = postLikeRepository.existsByPostAndUser(post, user);
        
        Map<String, Object> result = new HashMap<>();
        result.put("liked", isLiked);
        result.put("likeCount", post.getLikeCount());
        return result;
    }

    @Transactional
    public Map<String, Object> toggleLike(Long postId, String username) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        
        User user = userService.getUserByUsername(username);
        boolean isLiked = postLikeRepository.existsByPostAndUser(post, user);
        
        Map<String, Object> result = new HashMap<>();
        
        if (isLiked) {
            // 좋아요 취소
            postLikeRepository.deleteByPostAndUser(post, user);
            post.setLikeCount(post.getLikeCount() - 1);
            result.put("liked", false);
        } else {
            // 좋아요 추가
            PostLike postLike = new PostLike(post, user);
            postLikeRepository.save(postLike);
            post.setLikeCount(post.getLikeCount() + 1);
            result.put("liked", true);
        }
        
        postRepository.save(post);
        result.put("likeCount", post.getLikeCount());
        return result;
    }

    @Transactional
    public PostResponse updatePost(Long postId, PostCreateRequest request, String username) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        
        User currentUser = userService.getUserByUsername(username);
        if (!post.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("게시글은 작성자만 수정할 수 있습니다.");
        }

        post.setTitle(request.getTitle());
        post.setContent(request.getContent());

        return PostResponse.from(postRepository.save(post));
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getHotPostsByUniversity(Integer universityId) {
        return postRepository.findTop4ByBoardUniversityIdOrderByViewCountPlusLikeCountDesc(universityId)
                .stream()
                .map(PostResponse::from)
                .collect(Collectors.toList());
    }
} 