package com.example.location_app.service;

import com.example.location_app.dto.LocationDto;

public interface LocationService {
    void updateLocation(LocationDto locationDto);
    LocationDto getLocation(String userId);
} 