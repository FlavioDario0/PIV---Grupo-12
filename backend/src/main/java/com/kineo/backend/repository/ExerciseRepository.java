package com.kineo.backend.repository;

import com.kineo.backend.entity.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    Optional<Exercise> findByNome(String nome);

    List<Exercise> findByGrupoMuscularContainingIgnoreCase(String grupoMuscular);

    @Query("SELECT e FROM Exercise e WHERE LOWER(e.nome) LIKE LOWER(CONCAT('%', :termo, '%')) OR LOWER(e.grupoMuscular) LIKE LOWER(CONCAT('%', :termo, '%'))")
    List<Exercise> searchByTerm(@Param("termo") String termo);
}