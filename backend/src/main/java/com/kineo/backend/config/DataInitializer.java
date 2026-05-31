package com.kineo.backend.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kineo.backend.entity.Exercise;
import com.kineo.backend.repository.ExerciseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

//Essa classe serve para popular o banco com um dataset de mais de 500 exercicios em Json que coloquei junto ao projeto.
//Caso a biblioteca esteja vazia no seu banco, o springboot criara automaticamente a tabela sem necessidade de import.

@Component
public class DataInitializer implements CommandLineRunner {

    private final ExerciseRepository exerciseRepository;

    public DataInitializer(ExerciseRepository exerciseRepository) {
        this.exerciseRepository = exerciseRepository;
    }

    @Override
    public void run(String... args) throws Exception {

        if (exerciseRepository.count() == 0) {
            System.out.println("Biblioteca não encontrada, carregando dataset de exercicios...");

            try {
                InputStream inputStream = new ClassPathResource("exercicios.json").getInputStream();
                ObjectMapper mapper = new ObjectMapper();


                JsonNode rootNode = mapper.readTree(inputStream);
                List<Exercise> biblioteca = new ArrayList<>();

                if (rootNode.isArray()) {
                    for (JsonNode node : rootNode) {
                        Exercise ex = new Exercise();


                        ex.setNome(node.has("name") && !node.get("name").isNull() ? node.get("name").asText() : "Sem nome");
                        ex.setEquipamentos(node.has("equipment") && !node.get("equipment").isNull() ? node.get("equipment").asText() : "Peso Corporal");
                        ex.setNivelDificuldade(node.has("level") && !node.get("level").isNull() ? node.get("level").asText() : "Geral");

                        ex.setErrosComuns("-");

                        if (node.has("instructions") && node.get("instructions").isArray()) {
                            List<String> passos = new ArrayList<>();
                            for (JsonNode passo : node.get("instructions")) {
                                passos.add(passo.asText());
                            }
                            ex.setDescricao(String.join(" ", passos));
                        }

                        if (node.has("primaryMuscles") && node.get("primaryMuscles").isArray()) {
                            List<String> musculos = new ArrayList<>();
                            for (JsonNode musculo : node.get("primaryMuscles")) {
                                musculos.add(musculo.asText());
                            }

                            ex.setGrupoMuscular(String.join(", ", musculos));
                        }

                        biblioteca.add(ex);
                    }
                }

                if (!biblioteca.isEmpty()) {
                    exerciseRepository.saveAll(biblioteca);
                    System.out.println("Sucesso: " + biblioteca.size() + " exercicios extraidos do dataset e adicionados no Banco de dados");
                }

            } catch (Exception e) {
                System.err.println("Erro ao ler o arquivo JSON: " + e.getMessage());
                e.printStackTrace();
            }

        }
    }
}