package com.example.da_be.controller;

import com.example.da_be.service.HoaDonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/statistics")
public class StatisticsController {

    @Autowired
    private HoaDonService hoaDonService;

    @GetMapping("/today")
    public ResponseEntity<Map<String, Object>> getStatisticsToday() {
        Map<String, Object> statistics = hoaDonService.getStatisticsToday();
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/week")
    public ResponseEntity<Map<String, Object>> getStatisticsThisWeek() {
        Map<String, Object> statistics = hoaDonService.getStatisticsThisWeek();
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/month")
    public ResponseEntity<Map<String, Object>> getStatisticsThisMonth() {
        Map<String, Object> statistics = hoaDonService.getStatisticsThisMonth();
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/year")
    public ResponseEntity<Map<String, Object>> getStatisticsThisYear() {
        Map<String, Object> statistics = hoaDonService.getStatisticsThisYear();
        return ResponseEntity.ok(statistics);
    }
}
