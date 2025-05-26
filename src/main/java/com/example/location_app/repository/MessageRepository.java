package com.example.location_app.repository;

import com.example.location_app.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
 
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySenderIdAndReceiverIdOrderByCreatedAtDesc(Long senderId, Long receiverId);
    List<Message> findByReceiverIdAndIsReadFalse(Long receiverId);
} 