package com.kineo.backend.controller;

import com.kineo.backend.dto.WorkoutPlanRequest;
import com.kineo.backend.dto.WorkoutPlanResponse;
import com.kineo.backend.service.WorkoutPlanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workouts")
@CrossOrigin("*")
public class WorkoutPlanController {

    private final WorkoutPlanService workoutPlanService;

    public WorkoutPlanController(WorkoutPlanService workoutPlanService) {
        this.workoutPlanService = workoutPlanService;
    }

    @PostMapping
    public ResponseEntity<WorkoutPlanResponse> create(@RequestBody WorkoutPlanRequest request) {
        return ResponseEntity.ok(workoutPlanService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<WorkoutPlanResponse>> findAll() {
        return ResponseEntity.ok(workoutPlanService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkoutPlanResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(workoutPlanService.findById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<WorkoutPlanResponse>> findByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(workoutPlanService.findByUserId(userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        workoutPlanService.delete(id);
        return ResponseEntity.noContent().build();
    }
}