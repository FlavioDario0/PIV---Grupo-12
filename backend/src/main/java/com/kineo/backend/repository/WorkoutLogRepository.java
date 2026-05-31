package com.kineo.backend.repository;

import com.kineo.backend.entity.WorkoutLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WorkoutLogRepository extends JpaRepository<WorkoutLog, Long> {
    List<WorkoutLog> findByUserIdAndWorkoutExerciseIdOrderByDataTreinoDesc(Long userId, Long workoutExerciseId);
}