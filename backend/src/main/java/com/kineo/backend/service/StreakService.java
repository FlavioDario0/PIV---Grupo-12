package com.kineo.backend.service;

import com.kineo.backend.dto.StreakResponse;
import com.kineo.backend.dto.StreakSummaryResponse;
import com.kineo.backend.entity.WorkoutLog;
import com.kineo.backend.repository.WorkoutLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class StreakService {

    private final WorkoutLogRepository workoutLogRepository;

    public StreakService(WorkoutLogRepository workoutLogRepository) {
        this.workoutLogRepository = workoutLogRepository;
    }

    public StreakSummaryResponse resumo(Long userId) {

        List<WorkoutLog> logs = workoutLogRepository.findByUserIdOrderByDataTreinoDesc(userId);

        Set<LocalDate> diasTreinados = logs.stream()
                .map(WorkoutLog::getDataTreino)
                .filter(data -> data != null)
                .collect(Collectors.toSet());

        LocalDate hoje = LocalDate.now();
        boolean treinouHoje = diasTreinados.contains(hoje);

        int sequenciaTreinando = 0;

        LocalDate dataVerificacao = treinouHoje ? hoje : hoje.minusDays(1);

        while (diasTreinados.contains(dataVerificacao)) {
            sequenciaTreinando++;
            dataVerificacao = dataVerificacao.minusDays(1);
        }

        LocalDate ultimaData = diasTreinados.isEmpty() ? null : logs.get(0).getDataTreino();

        return new StreakSummaryResponse(
                userId,
                treinouHoje,
                sequenciaTreinando,
                0,
                diasTreinados.size(),
                logs.size(),
                ultimaData
        );
    }

    public List<StreakResponse> historico(Long userId) {
        List<WorkoutLog> logs = workoutLogRepository.findByUserIdOrderByDataTreinoDesc(userId);
        Set<LocalDate> diasTreinados = logs.stream()
                .map(WorkoutLog::getDataTreino)
                .filter(data -> data != null)
                .collect(Collectors.toSet());

        List<StreakResponse> historicoRecente = new ArrayList<>();
        LocalDate hoje = LocalDate.now();


        for (int i = 6; i >= 0; i--) {
            LocalDate dia = hoje.minusDays(i);
            boolean treinou = diasTreinados.contains(dia);

            StreakResponse resp = new StreakResponse();
            resp.setData(dia);
            resp.setTreinou(treinou);
            historicoRecente.add(resp);
        }

        return historicoRecente;
    }
}