package com.kineo.backend.dto;

import com.kineo.backend.entity.WorkoutPlan;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
public class WorkoutPlanResponse {
    private Long id;
    private String titulo;
    private String objetivo;
    private LocalDate dataCriacao;
    private Long userId;
    private List<WorkoutExerciseResponse> exercicios;

    public static WorkoutPlanResponse fromEntity(WorkoutPlan workoutPlan) {
        return new WorkoutPlanResponse(
                workoutPlan.getId(),
                workoutPlan.getTitulo(),
                workoutPlan.getObjetivo(),
                workoutPlan.getDataCriacao(),
                workoutPlan.getUser().getId(),
                workoutPlan.getExercicios()
                        .stream()
                        .map(WorkoutExerciseResponse::fromEntity)
                        .toList()
        );
    }
}