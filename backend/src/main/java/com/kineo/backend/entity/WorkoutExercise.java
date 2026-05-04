package com.kineo.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "workout_exercises")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutExercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nome do exercício (ex: Supino Reto, Agachamento)
    @Column(nullable = false)
    private String name;

    // Grupo muscular (ex: Peito, Pernas) - Útil para a sua "Biblioteca" no frontend
    private String muscleGroup;

    // Número de séries
    private Integer sets;

    // Número de repetições (pode ser String para suportar "10-12" ou "Até a falha")
    private String repetitions;

    // Peso/Carga utilizada
    private Double weight;

    // Tempo de descanso entre séries (em segundos ou formato String "01:00")
    private String restTime;

    // Observações extras (ex: "Focar na descida lenta")
    private String notes;

    // Relacionamento: Vários exercícios pertencem a um Plano de Treino
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_plan_id")
    private WorkoutPlan workoutPlan;
}