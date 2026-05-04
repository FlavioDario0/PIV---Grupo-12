package com.kineo.backend.config;

import com.kineo.backend.entity.Exercise;
import com.kineo.backend.entity.Musculos;
import com.kineo.backend.repository.ExerciseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(ExerciseRepository repository) {
        return args -> {
            // Só insere se o banco estiver vazio
            if (repository.count() == 0) {

                Exercise supino = new Exercise();
                supino.setNome("Supino Reto");
                supino.setImagens(Arrays.asList("../assets/img/supino1.png", "../assets/img/supino2.png"));
                supino.setDescricao("Exercício para peitoral");
                supino.setEquipamentos("Barra");
                supino.setNiveis(Arrays.asList("Iniciante", "Intermediário"));

                Musculos mSupino = new Musculos();
                mSupino.setPrincipal("peito");
                mSupino.setSecundarios(Arrays.asList("bíceps", "tríceps"));
                supino.setMusculos(mSupino);

                supino.setErros(Arrays.asList("Abrir demais os cotovelos"));

                Exercise agachamento = new Exercise();
                agachamento.setNome("Agachamento Livre");
                agachamento.setImagens(Arrays.asList("../assets/img/agacho1.png", "../assets/img/agacho2.png"));
                agachamento.setDescricao("Exercício completo para pernas");
                agachamento.setEquipamentos("Barra");
                agachamento.setNiveis(Arrays.asList("Intermediário", "Avançado"));

                Musculos mAgachamento = new Musculos();
                mAgachamento.setPrincipal("quadríceps");
                mAgachamento.setSecundarios(Arrays.asList("glúteo", "posterior"));
                agachamento.setMusculos(mAgachamento);

                agachamento.setErros(Arrays.asList("Curvar a coluna", "Joelho entrar para dentro"));

                // Salva os dois no banco
                repository.saveAll(Arrays.asList(supino, agachamento));

                System.out.println("Exercícios de teste inseridos com sucesso!");
            }
        };
    }
}