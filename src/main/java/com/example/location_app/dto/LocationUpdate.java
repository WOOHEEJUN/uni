package com.example.location_app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LocationUpdate {
    private Long userId;
    private Double latitude;
    private Double longitude;
} 