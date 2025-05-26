package com.example.location_app.service;

import org.springframework.stereotype.Service;
import com.example.location_app.dto.LocationDto;

@Service
public class LocationServiceImpl implements LocationService {
    
    @Override
    public void updateLocation(LocationDto locationDto) {
        // 위치 업데이트 로직 구현
    }

    @Override
    public LocationDto getLocation(String userId) {
        // 위치 조회 로직 구현
        return new LocationDto();
    }
} 