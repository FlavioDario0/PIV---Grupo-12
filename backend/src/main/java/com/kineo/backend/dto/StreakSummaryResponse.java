package com.kineo.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class StreakSummaryResponse {

    private Long userId;
    private Boolean treinouHoje;
    private Integer sequenciaTreinando;
    private Integer sequenciaSemTreinar;
    private Integer totalDiasTreinados;
    private Integer totalDiasRegistrados;
    private LocalDate ultimaDataRegistrada;
}