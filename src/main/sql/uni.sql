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

-- 6. 게시판 종류 (자유, 비밀, 중고거래)
CREATE TABLE boards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    university_id INT,
    name VARCHAR(50) NOT NULL,
    type ENUM('FREE', 'ANONYMOUS', 'MARKET', 'DEPARTMENT') NOT NULL,
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
    like_count INT DEFAULT 0,
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

-- 사용자 시간표 테이블
CREATE TABLE IF NOT EXISTS user_schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL COMMENT '사용자 ID',
    title VARCHAR(100) NOT NULL COMMENT '일정 제목',
    day_of_week INT NOT NULL COMMENT '요일 (1:월, 2:화, 3:수, 4:목, 5:금)',
    start_time TIME NOT NULL COMMENT '시작 시간',
    end_time TIME NOT NULL COMMENT '종료 시간',
    color VARCHAR(20) DEFAULT '#4285F4' COMMENT '색상',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
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
(1, '학과게시판', 'DEPARTMENT'),
(2, '자유게시판', 'FREE'),
(2, '비밀게시판', 'ANONYMOUS'),
(2, '중고거래게시판', 'MARKET'),
(2, '학과게시판', 'DEPARTMENT'),
(3, '자유게시판', 'FREE'),
(3, '비밀게시판', 'ANONYMOUS'),
(3, '중고거래게시판', 'MARKET'),
(3, '학과게시판', 'DEPARTMENT'),
(4, '자유게시판', 'FREE'),
(4, '비밀게시판', 'ANONYMOUS'),
(4, '중고거래게시판', 'MARKET'),
(4, '학과게시판', 'DEPARTMENT'),
(5, '자유게시판', 'FREE'),
(5, '비밀게시판', 'ANONYMOUS'),
(5, '중고거래게시판', 'MARKET'),
(5, '학과게시판', 'DEPARTMENT'),
(6, '자유게시판', 'FREE'),
(6, '비밀게시판', 'ANONYMOUS'),
(6, '중고거래게시판', 'MARKET'),
(6, '학과게시판', 'DEPARTMENT'),
(7, '자유게시판', 'FREE'),
(7, '비밀게시판', 'ANONYMOUS'),
(7, '중고거래게시판', 'MARKET'),
(7, '학과게시판', 'DEPARTMENT'),
(8, '자유게시판', 'FREE'),
(8, '비밀게시판', 'ANONYMOUS'),
(8, '중고거래게시판', 'MARKET'),
(8, '학과게시판', 'DEPARTMENT'),
(9, '자유게시판', 'FREE'),
(9, '비밀게시판', 'ANONYMOUS'),
(9, '중고거래게시판', 'MARKET'),
(9, '학과게시판', 'DEPARTMENT'),
(10, '자유게시판', 'FREE'),
(10, '비밀게시판', 'ANONYMOUS'),
(10, '중고거래게시판', 'MARKET'),
(10, '학과게시판', 'DEPARTMENT');

