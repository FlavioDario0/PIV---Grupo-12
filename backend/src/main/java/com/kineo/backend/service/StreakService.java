package com.kineo.backend.service;

import com.kineo.backend.dto.StreakRequest;
import com.kineo.backend.dto.StreakResponse;
import com.kineo.backend.dto.StreakSummaryResponse;
import com.kineo.backend.entity.Streak;
import com.kineo.backend.entity.User;
import com.kineo.backend.repository.StreakRepository;
import com.kineo.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Service
public class StreakService {

    private final StreakRepository streakRepository;
    private final UserRepository userRepository;

    public StreakService(StreakRepository streakRepository, UserRepository userRepository) {
        this.streakRepository = streakRepository;
        this.userRepository = userRepository;
    }

    public StreakResponse marcarHoje(StreakRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        LocalDate hoje = LocalDate.now();

        Streak streak = streakRepository.findByUserIdAndData(request.getUserId(), hoje)
                .orElse(new Streak());

        streak.setUser(user);
        streak.setData(hoje);
        streak.setTreinou(request.getTreinou());

        Streak saved = streakRepository.save(streak);

        return StreakResponse.fromEntity(saved);
    }

    public List<StreakResponse> historico(Long userId) {
        return streakRepository.findByUserIdOrderByDataDesc(userId)
                .stream()
                .map(StreakResponse::fromEntity)
                .toList();
    }

    public StreakSummaryResponse resumo(Long userId) {
        List<Streak> registros = streakRepository.findByUserIdOrderByDataDesc(userId);

        if (registros.isEmpty()) {
            return new StreakSummaryResponse(
                    userId,
                    false,
                    0,
                    0,
                    0,
                    0,
                    null
            );
        }

        List<Streak> ordenados = registros.stream()
                .sorted(Comparator.comparing(Streak::getData).reversed())
                .toList();

        LocalDate hoje = LocalDate.now();

        Boolean treinouHoje = streakRepository.findByUserIdAndData(userId, hoje)
                .map(Streak::getTreinou)
                .orElse(false);

        int sequenciaTreinando = calcularSequencia(ordenados, true);
        int sequenciaSemTreinar = calcularSequencia(ordenados, false);

        int totalDiasTreinados = (int) registros.stream()
                .filter(streak -> Boolean.TRUE.equals(streak.getTreinou()))
                .count();

        LocalDate ultimaData = ordenados.get(0).getData();

        return new StreakSummaryResponse(
                userId,
                treinouHoje,
                sequenciaTreinando,
                sequenciaSemTreinar,
                totalDiasTreinados,
                registros.size(),
                ultimaData
        );
    }

    private int calcularSequencia(List<Streak> registros, boolean valorEsperado) {
        int sequencia = 0;
        LocalDate dataEsperada = LocalDate.now();

        for (Streak streak : registros) {
            if (!streak.getData().equals(dataEsperada)) {
                break;
            }

            if (Boolean.TRUE.equals(streak.getTreinou()) == valorEsperado) {
                sequencia++;
                dataEsperada = dataEsperada.minusDays(1);
            } else {
                break;
            }
        }

        return sequencia;
    }
}