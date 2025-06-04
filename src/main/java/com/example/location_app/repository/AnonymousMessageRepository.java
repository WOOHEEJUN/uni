package com.example.location_app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.location_app.entity.AnonymousMessage;

public interface AnonymousMessageRepository extends JpaRepository<AnonymousMessage, Long> {
}