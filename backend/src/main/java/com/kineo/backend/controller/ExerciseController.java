package com.kineo.backend.controller;

import com.kineo.backend.entity.Exercise;
import com.kineo.backend.repository.ExerciseRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/exercises")
@CrossOrigin("*")
public class ExerciseController {

    private final ExerciseRepository exerciseRepository;

    public ExerciseController(ExerciseRepository exerciseRepository) {
        this.exerciseRepository = exerciseRepository;
    }

    // Retorna 5 exercícios aleatórios do grupo muscular selecionado
    @GetMapping("/categoria/{grupo}")
    public ResponseEntity<List<Exercise>> getByCategoria(@PathVariable String grupo) {
        List<Exercise> exercises = exerciseRepository.findByGrupoMuscularContainingIgnoreCase(grupo);

        // Embaralha os resultados para ficarem aleatórios
        Collections.shuffle(exercises);

        // Pega apenas os 5 primeiros
        List<Exercise> randomFive = exercises.stream().limit(5).collect(Collectors.toList());
        return ResponseEntity.ok(randomFive);
    }

    // Busca exercícios pelo texto digitado
    @GetMapping("/buscar")
    public ResponseEntity<List<Exercise>> search(@RequestParam String q) {
        List<Exercise> exercises = exerciseRepository.searchByTerm(q);
        return ResponseEntity.ok(exercises);
    }
}