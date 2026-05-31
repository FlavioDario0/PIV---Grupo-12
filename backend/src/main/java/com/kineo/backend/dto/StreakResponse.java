package com.kineo.backend.dto;

import com.kineo.backend.entity.Streak;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class StreakResponse {

    private Long id;
    private Long userId;
    private LocalDate data;
    private Boolean treinou;

    public static StreakResponse fromEntity(Streak streak) {
        return new StreakResponse(
                streak.getId(),
                streak.getUser().getId(),
                streak.getData(),
                streak.getTreinou()
        );
    }
}