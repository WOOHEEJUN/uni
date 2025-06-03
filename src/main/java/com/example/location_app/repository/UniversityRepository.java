package com.example.location_app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.location_app.entity.University;

public interface UniversityRepository extends JpaRepository<University, Integer> {
}