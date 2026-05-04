package com.kineo.backend.repository;

import com.kineo.backend.entity.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    // Removemos a busca por muscleGroup pois o filtro agora é feito no frontend
}