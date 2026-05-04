package com.kineo.backend.dto;

import lombok.Data;

@Data
public class WorkoutExerciseRequest {
    private String diaSemana;
    private String nomeExercicio;
    private String grupoMuscular;
    private Integer series;
    private Integer repeticoes;
    private Integer descansoSegundos;
    private String observacoes;
}