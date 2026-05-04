package com.kineo.backend.repository;

import com.kineo.backend.entity.Streak;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface StreakRepository extends JpaRepository<Streak, Long> {

    List<Streak> findByUserIdOrderByDataDesc(Long userId);

    Optional<Streak> findByUserIdAndData(Long userId, LocalDate data);
}