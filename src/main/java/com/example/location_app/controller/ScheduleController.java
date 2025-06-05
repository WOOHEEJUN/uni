package com.example.location_app.controller;

import com.example.location_app.entity.UserSchedule;
import com.example.location_app.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @GetMapping
    public ResponseEntity<List<UserSchedule>> getSchedules(@RequestAttribute Integer userId) {
        try {
            List<UserSchedule> schedules = scheduleService.getSchedulesByUserId(userId);
            return ResponseEntity.ok(schedules);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createSchedule(
            @RequestBody UserSchedule schedule,
            @RequestAttribute Integer userId) {
        try {
            if (schedule.getTitle() == null || schedule.getTitle().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("일정 제목은 필수입니다.");
            }
            if (schedule.getDayOfWeek() == null || schedule.getDayOfWeek() < 1 || schedule.getDayOfWeek() > 5) {
                return ResponseEntity.badRequest().body("올바른 요일을 선택해주세요.");
            }
            if (schedule.getStartTime() == null || schedule.getEndTime() == null) {
                return ResponseEntity.badRequest().body("시작 시간과 종료 시간은 필수입니다.");
            }
            
            schedule.setUserId(userId);
            UserSchedule savedSchedule = scheduleService.createSchedule(schedule);
            return ResponseEntity.ok(savedSchedule);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSchedule(
            @PathVariable Integer id,
            @RequestBody UserSchedule schedule,
            @RequestAttribute Integer userId) {
        try {
            if (schedule.getTitle() == null || schedule.getTitle().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("일정 제목은 필수입니다.");
            }
            if (schedule.getDayOfWeek() == null || schedule.getDayOfWeek() < 1 || schedule.getDayOfWeek() > 5) {
                return ResponseEntity.badRequest().body("올바른 요일을 선택해주세요.");
            }
            if (schedule.getStartTime() == null || schedule.getEndTime() == null) {
                return ResponseEntity.badRequest().body("시작 시간과 종료 시간은 필수입니다.");
            }
            
            schedule.setId(id);
            schedule.setUserId(userId);
            UserSchedule updatedSchedule = scheduleService.updateSchedule(schedule);
            return ResponseEntity.ok(updatedSchedule);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSchedule(
            @PathVariable Integer id,
            @RequestAttribute Integer userId) {
        try {
            scheduleService.deleteSchedule(id, userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 