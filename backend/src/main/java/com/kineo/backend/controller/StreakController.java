package com.kineo.backend.controller;

import com.kineo.backend.dto.StreakRequest;
import com.kineo.backend.dto.StreakResponse;
import com.kineo.backend.dto.StreakSummaryResponse;
import com.kineo.backend.service.StreakService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/streaks")
@CrossOrigin("*")
public class StreakController {

    private final StreakService streakService;

    public StreakController(StreakService streakService) {
        this.streakService = streakService;
    }

    @PostMapping("/today")
    public ResponseEntity<StreakResponse> marcarHoje(@RequestBody StreakRequest request) {
        return ResponseEntity.ok(streakService.marcarHoje(request));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<StreakResponse>> historico(@PathVariable Long userId) {
        return ResponseEntity.ok(streakService.historico(userId));
    }

    @GetMapping("/user/{userId}/summary")
    public ResponseEntity<StreakSummaryResponse> resumo(@PathVariable Long userId) {
        return ResponseEntity.ok(streakService.resumo(userId));
    }
}