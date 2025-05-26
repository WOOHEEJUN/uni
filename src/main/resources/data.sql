-- 테스트용 사용자 데이터
INSERT INTO users (username, password, nickname, email, phone_number, location_sharing_enabled, created_at, updated_at)
VALUES 
('user1', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', '사용자1', 'user1@test.com', '010-1111-1111', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('user2', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', '사용자2', 'user2@test.com', '010-2222-2222', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
 
-- 테스트용 친구 관계 데이터
INSERT INTO friendships (user_id, friend_id, status, created_at, updated_at)
VALUES 
(1, 2, 'ACCEPTED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 1, 'ACCEPTED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP); 