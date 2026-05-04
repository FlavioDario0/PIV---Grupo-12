package com.kineo.backend.dto;

import com.kineo.backend.entity.WorkoutExercise;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class WorkoutExerciseResponse {
    private Long id;
    private String diaSemana;
    private String nomeExercicio;
    private String grupoMuscular;
    private Integer series;
    private Integer repeticoes;
    private Integer descansoSegundos;
    private String observacoes;

    public static WorkoutExerciseResponse fromEntity(WorkoutExercise exercise) {
        return new WorkoutExerciseResponse(
                exercise.getId(),
                exercise.getDiaSemana(),
                exercise.getNomeExercicio(),
                exercise.getGrupoMuscular(),
                exercise.getSeries(),
                exercise.getRepeticoes(),
                exercise.getDescansoSegundos(),
                exercise.getObservacoes()
        );
    }
}