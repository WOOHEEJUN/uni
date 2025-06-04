package com.example.location_app.service;

import com.example.location_app.entity.UserSchedule;
import com.example.location_app.repository.UserScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ScheduleService {

    @Autowired
    private UserScheduleRepository scheduleRepository;

    public List<UserSchedule> getSchedulesByUserId(Integer userId) {
        return scheduleRepository.findByUserId(userId);
    }

    @Transactional
    public UserSchedule createSchedule(UserSchedule schedule) {
        return scheduleRepository.save(schedule);
    }

    @Transactional
    public void deleteSchedule(Integer id, Integer userId) {
        UserSchedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("일정을 찾을 수 없습니다."));
        
        if (!schedule.getUserId().equals(userId)) {
            throw new RuntimeException("해당 일정을 삭제할 권한이 없습니다.");
        }
        
        scheduleRepository.delete(schedule);
    }
} 