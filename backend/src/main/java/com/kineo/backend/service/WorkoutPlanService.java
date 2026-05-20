package com.kineo.backend.service;

import com.kineo.backend.dto.WorkoutExerciseRequest;
import com.kineo.backend.dto.WorkoutPlanRequest;
import com.kineo.backend.dto.WorkoutPlanResponse;
import com.kineo.backend.entity.User;
import com.kineo.backend.entity.WorkoutExercise;
import com.kineo.backend.entity.WorkoutPlan;
import com.kineo.backend.repository.UserRepository;
import com.kineo.backend.repository.WorkoutPlanRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class WorkoutPlanService {

    private final WorkoutPlanRepository workoutPlanRepository;
    private final UserRepository userRepository;

    public WorkoutPlanService(
            WorkoutPlanRepository workoutPlanRepository,
            UserRepository userRepository
    ) {
        this.workoutPlanRepository = workoutPlanRepository;
        this.userRepository = userRepository;
    }

    public WorkoutPlanResponse create(WorkoutPlanRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        WorkoutPlan workoutPlan = new WorkoutPlan();
        workoutPlan.setTitulo(request.getTitulo());
        workoutPlan.setObjetivo(request.getObjetivo());
        workoutPlan.setDataCriacao(LocalDate.now());
        workoutPlan.setUser(user);

        // adiciona exercícios
        for (WorkoutExerciseRequest exerciseRequest : request.getExercicios()) {

            WorkoutExercise exercise = new WorkoutExercise();

            exercise.setDiaSemana(exerciseRequest.getDiaSemana());
            exercise.setNomeExercicio(exerciseRequest.getNomeExercicio());
            exercise.setGrupoMuscular(exerciseRequest.getGrupoMuscular());
            exercise.setSeries(exerciseRequest.getSeries());
            exercise.setRepeticoes(exerciseRequest.getRepeticoes());
            exercise.setDescansoSegundos(exerciseRequest.getDescansoSegundos());
            exercise.setObservacoes(exerciseRequest.getObservacoes());

            exercise.setWorkoutPlan(workoutPlan);

            workoutPlan.getExercicios().add(exercise);
        }

        WorkoutPlan savedWorkoutPlan = workoutPlanRepository.save(workoutPlan);

        return WorkoutPlanResponse.fromEntity(savedWorkoutPlan);
    }

    public List<WorkoutPlanResponse> findAll() {
        return workoutPlanRepository.findAll()
                .stream()
                .map(WorkoutPlanResponse::fromEntity)
                .toList();
    }

    public WorkoutPlanResponse findById(Long id) {
        WorkoutPlan workoutPlan = workoutPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ficha de treino não encontrada"));

        return WorkoutPlanResponse.fromEntity(workoutPlan);
    }

    public List<WorkoutPlanResponse> findByUserId(Long userId) {
        return workoutPlanRepository.findByUserId(userId)
                .stream()
                .map(WorkoutPlanResponse::fromEntity)
                .toList();
    }

    public void delete(Long id) {
        if (!workoutPlanRepository.existsById(id)) {
            throw new RuntimeException("Ficha de treino não encontrada");
        }

        workoutPlanRepository.deleteById(id);
    }
}