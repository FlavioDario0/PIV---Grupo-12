package com.kineo.backend.repository;

import com.kineo.backend.entity.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    Optional<Exercise> findByNome(String nome);
}