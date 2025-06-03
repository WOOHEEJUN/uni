drop database if exists uni;
-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS uni DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE uni;

-- 1. 대학교 테이블
CREATE TABLE universities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    domain VARCHAR(100)
);

-- 2. 사용자 테이블
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    university_id INT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(50) NOT NULL UNIQUE,
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'REJECTED',
    FOREIGN KEY (university_id) REFERENCES universities(id)
);

-- 3. 인증서 제출 (이미지 업로드 정보)
CREATE TABLE user_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    image_path VARCHAR(255) NOT NULL, -- 업로드된 이미지 경로
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 4. 채팅방 (같은 Wi-Fi 사용자는 같은 university_id를 공유)
CREATE TABLE chat_rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    university_id INT,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (university_id) REFERENCES universities(id)
);

-- 5. 채팅 메시지
CREATE TABLE chat_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT,
    sender_id INT,
    message TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES chat_rooms(id),
    FOREIGN KEY (sender_id) REFERENCES users(id)
);

-- 6. 게시판 종류 (자유, 비밀, 중고거래)
CREATE TABLE boards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    university_id INT,
    name VARCHAR(50) NOT NULL,
    type ENUM('FREE', 'ANONYMOUS', 'MARKET') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (university_id) REFERENCES universities(id)
);

-- 7. 게시글 테이블
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    board_id INT,
    user_id INT,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (board_id) REFERENCES boards(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 8. 댓글 테이블
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT,
    user_id INT,
    content TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 9. 게시판 좋아요 테이블
CREATE TABLE post_likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_post_user (post_id, user_id)
);

INSERT INTO universities (name, domain) VALUES
('서울대학교', 'snu.ac.kr'),
('연세대학교', 'yonsei.ac.kr'),
('고려대학교', 'korea.ac.kr'),
('성균관대학교', 'skku.edu'),
('한양대학교', 'hanyang.ac.kr'),
('중앙대학교', 'cau.ac.kr'),
('경희대학교', 'khu.ac.kr'),
('이화여자대학교', 'ewha.ac.kr'),
('건국대학교', 'konkuk.ac.kr'),
('홍익대학교', 'hongik.ac.kr');

-- 10. 게시판 기본 데이터 삽입
INSERT INTO boards (university_id, name, type) VALUES
(1, '자유게시판', 'FREE'),
(1, '비밀게시판', 'ANONYMOUS'),
(1, '중고거래게시판', 'MARKET'),
(1, '학과게시판', 'FREE'),
(2, '자유게시판', 'FREE'),
(2, '비밀게시판', 'ANONYMOUS'),
(2, '중고거래게시판', 'MARKET'),
(2, '학과게시판', 'FREE'),
(3, '자유게시판', 'FREE'),
(3, '비밀게시판', 'ANONYMOUS'),
(3, '중고거래게시판', 'MARKET'),
(3, '학과게시판', 'FREE'),
(4, '자유게시판', 'FREE'),
(4, '비밀게시판', 'ANONYMOUS'),
(4, '중고거래게시판', 'MARKET'),
(4, '학과게시판', 'FREE'),
(5, '자유게시판', 'FREE'),
(5, '비밀게시판', 'ANONYMOUS'),
(5, '중고거래게시판', 'MARKET'),
(5, '학과게시판', 'FREE'),
(6, '자유게시판', 'FREE'),
(6, '비밀게시판', 'ANONYMOUS'),
(6, '중고거래게시판', 'MARKET'),
(6, '학과게시판', 'FREE'),
(7, '자유게시판', 'FREE'),
(7, '비밀게시판', 'ANONYMOUS'),
(7, '중고거래게시판', 'MARKET'),
(7, '학과게시판', 'FREE'),
(8, '자유게시판', 'FREE'),
(8, '비밀게시판', 'ANONYMOUS'),
(8, '중고거래게시판', 'MARKET'),
(8, '학과게시판', 'FREE'),
(9, '자유게시판', 'FREE'),
(9, '비밀게시판', 'ANONYMOUS'),
(9, '중고거래게시판', 'MARKET'),
(9, '학과게시판', 'FREE'),
(10, '자유게시판', 'FREE'),
(10, '비밀게시판', 'ANONYMOUS'),
(10, '중고거래게시판', 'MARKET'),
(10, '학과게시판', 'FREE');

