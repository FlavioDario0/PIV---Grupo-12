package com.kineo.backend.controller;

import com.kineo.backend.entity.Exercise;
import com.kineo.backend.service.ExerciseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exercises")
@CrossOrigin(origins = "*")
public class ExerciseController {

    @Autowired
    private ExerciseService exerciseService;

    @GetMapping
    public ResponseEntity<List<Exercise>> getLibrary() {
        return ResponseEntity.ok(exerciseService.getAllExercises());
    }
}