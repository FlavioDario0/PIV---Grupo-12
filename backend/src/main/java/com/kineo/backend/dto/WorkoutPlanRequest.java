package com.kineo.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class WorkoutPlanRequest {
    private Long userId;
    private String titulo;
    private String objetivo;
    private List<WorkoutExerciseRequest> exercicios;
}