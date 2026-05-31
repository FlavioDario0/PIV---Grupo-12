package com.kineo.backend.controller;

import com.kineo.backend.entity.User;
import com.kineo.backend.entity.WorkoutExercise;
import com.kineo.backend.entity.WorkoutLog;
import com.kineo.backend.repository.UserRepository;
import com.kineo.backend.repository.WorkoutExerciseRepository;
import com.kineo.backend.repository.WorkoutLogRepository;
import com.kineo.backend.service.PyTorchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/treino")
@CrossOrigin("*")
public class WorkoutLogController {

    private final WorkoutLogRepository workoutLogRepository;
    private final WorkoutExerciseRepository workoutExerciseRepository;
    private final UserRepository userRepository;
    private final PyTorchService pyTorchService;

    public WorkoutLogController(WorkoutLogRepository workoutLogRepository,
                                WorkoutExerciseRepository workoutExerciseRepository,
                                UserRepository userRepository,
                                PyTorchService pyTorchService) {
        this.workoutLogRepository = workoutLogRepository;
        this.workoutExerciseRepository = workoutExerciseRepository;
        this.userRepository = userRepository;
        this.pyTorchService = pyTorchService;
    }

    @PostMapping("/finalizar-exercicio")
    public ResponseEntity<?> finalizarExercicio(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            Long workoutExerciseId = Long.valueOf(request.get("workoutExerciseId").toString());
            double cargaUsada = Double.parseDouble(request.get("cargaUsada").toString());
            int repsFeitas = Integer.parseInt(request.get("repsFeitas").toString());

            Optional<User> userOpt = userRepository.findById(userId);
            Optional<WorkoutExercise> exerciseOpt = workoutExerciseRepository.findById(workoutExerciseId);

            if (userOpt.isEmpty() || exerciseOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("erro", "Utilizador ou Exercício não encontrado."));
            }

            User user = userOpt.get();
            WorkoutExercise workoutExercise = exerciseOpt.get();
            int metaReps = workoutExercise.getRepeticoes();


            List<WorkoutLog> historico = workoutLogRepository.findByUserIdAndWorkoutExerciseIdOrderByDataTreinoDesc(userId, workoutExerciseId);

            int falhasConsecutivas = (repsFeitas < metaReps) ? 1 : 0;
            int diasComMesmaCarga = 0;

            for (WorkoutLog logAntigo : historico) {

                if (logAntigo.getCargaUsada() == cargaUsada) {
                    diasComMesmaCarga++;
                } else {
                    break;
                }
            }

            if (falhasConsecutivas == 1) {
                for (WorkoutLog logAntigo : historico) {
                    if (logAntigo.getRepeticoesFeitas() < metaReps) {
                        falhasConsecutivas++;
                    } else {
                        break;
                    }
                }
            }


            WorkoutLog log = new WorkoutLog();
            log.setUser(user);
            log.setWorkoutExercise(workoutExercise);
            log.setDataTreino(LocalDate.now());
            log.setCargaUsada(cargaUsada);
            log.setRepeticoesFeitas(repsFeitas);
            workoutLogRepository.save(log);


            Map<String, Object> previsaoPython = pyTorchService.preverProximaCarga(
                    cargaUsada,
                    diasComMesmaCarga,
                    metaReps,
                    repsFeitas,
                    falhasConsecutivas
            );


            if (previsaoPython.containsKey("carga_recomendada")) {
                double novaCarga = Double.parseDouble(previsaoPython.get("carga_recomendada").toString());
                workoutExercise.setCargaRecomendada(novaCarga);
                workoutExerciseRepository.save(workoutExercise);
            }

            return ResponseEntity.ok(Map.of(
                    "mensagem", "Treino registado com sucesso!",
                    "previsao_ia", previsaoPython
            ));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("erro", "Falha ao registar treino: " + e.getMessage()));
        }
    }
}