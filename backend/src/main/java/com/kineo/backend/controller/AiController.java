package com.kineo.backend.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kineo.backend.dto.WorkoutExerciseRequest;
import com.kineo.backend.dto.WorkoutPlanRequest;
import com.kineo.backend.dto.WorkoutPlanResponse;
import com.kineo.backend.entity.Exercise;
import com.kineo.backend.repository.ExerciseRepository;
import com.kineo.backend.service.AiService;
import com.kineo.backend.service.PyTorchService;
import com.kineo.backend.service.WorkoutPlanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/chat")
@CrossOrigin("*")
public class AiController {

    private final AiService aiService;
    private final PyTorchService pyTorchService;
    private final ExerciseRepository exerciseRepository;
    private final WorkoutPlanService workoutPlanService;


    public AiController(AiService aiService, PyTorchService pyTorchService,
                        ExerciseRepository exerciseRepository, WorkoutPlanService workoutPlanService) {
        this.aiService = aiService;
        this.pyTorchService = pyTorchService;
        this.exerciseRepository = exerciseRepository;
        this.workoutPlanService = workoutPlanService;
    }

    @PostMapping("/perguntar")
    public ResponseEntity<Map<String, String>> perguntar(@RequestBody Map<String, String> request) {
        String pergunta = request.get("pergunta");

        if (pergunta == null || pergunta.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("resposta", "A pergunta não pode estar vazia."));
        }

        String promptContexto = "Aja como um personal trainer especialista e educado. " +
                "Responda de forma curta, direta e motivadora a seguinte dúvida: " + pergunta;

        // O Frontend vai receber apenas: {"resposta": "Olá! Para hipertrofia, eu recomendo..."}
        String respostaDaIA = aiService.perguntarAoOllama(promptContexto, false);

        return ResponseEntity.ok(Map.of("resposta", respostaDaIA));
    }

    @PostMapping("/prever-evolucao")
    public ResponseEntity<Map<String, Object>> preverEvolucao(@RequestBody Map<String, Object> request) {
        try {
            if (!request.containsKey("carga_atual") || !request.containsKey("dias_treinados")) {
                return ResponseEntity.badRequest().body(Map.of("erro", "Campos 'carga_atual' e 'dias_treinados' são obrigatórios."));
            }

            double cargaAtual = Double.parseDouble(request.get("carga_atual").toString());
            int diasTreinados = Integer.parseInt(request.get("dias_treinados").toString());

            Map<String, Object> previsaoPython = pyTorchService.preverProximaCarga(cargaAtual, diasTreinados, 10, 10, 0);

            return ResponseEntity.ok(previsaoPython);

        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Formato de número inválido."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("erro", "Erro interno: " + e.getMessage()));
        }
    }


    @PostMapping("/gerar-treino")
    public ResponseEntity<?> gerarTreino(@RequestBody Map<String, Object> request) {
        try {
            if (!request.containsKey("userId")) {
                return ResponseEntity.badRequest().body(Map.of("erro", "O campo 'userId' é obrigatório."));
            }

            Long userId = Long.valueOf(request.get("userId").toString());
            String objetivo = request.getOrDefault("objetivo", "Hipertrofia").toString();
            String diasPorSemana = request.getOrDefault("dias", "4").toString();
            String nivel = request.getOrDefault("nivel", "Intermediário").toString();


            String promptJSON = String.format(
                    "Gere a divisão de treino para nível %s, objetivo %s, %s dias. " +
                            "Responda APENAS com este JSON exato: " +
                            "{ \"titulo\": \"Ficha\", \"treinos\": [ { \"diaSemana\": \"Treino A\", \"musculosAlvo\": [\"peito\", \"triceps\"] } ] } " +
                            "NÃO adicione introduções, NÃO use markdown, NÃO escreva observações longas.",
                    nivel, objetivo, diasPorSemana
            );

            String respostaOllama = aiService.perguntarAoOllama(promptJSON, true);

            if (respostaOllama.startsWith("Erro") || respostaOllama.startsWith("Desculpe")) {
                return ResponseEntity.status(503).body(Map.of("erro", "Serviço de IA indisponível: " + respostaOllama));
            }


            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode;
            try {
                rootNode = mapper.readTree(respostaOllama);
            } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
                return ResponseEntity.status(500).body(Map.of(
                        "erro", "A IA sobrecarregou e cortou o treino no meio. Por favor, clique em gerar novamente.",
                        "respostaIncompleta", respostaOllama
                ));
            }

            WorkoutPlanRequest planRequest = new WorkoutPlanRequest();
            planRequest.setUserId(userId);
            planRequest.setTitulo(rootNode.has("titulo") ? rootNode.get("titulo").asText() : "Treino Personalizado");
            planRequest.setObjetivo(objetivo);

            List<WorkoutExerciseRequest> exerciseRequests = new ArrayList<>();
            JsonNode treinosNode = rootNode.get("treinos");

            List<Exercise> todosOsExercicios = exerciseRepository.findAll();

            if (treinosNode != null && treinosNode.isArray()) {
                for (JsonNode treinoNode : treinosNode) {
                    String diaSemana = treinoNode.get("diaSemana").asText();
                    JsonNode musculosNode = treinoNode.get("musculosAlvo");

                    if (musculosNode != null && musculosNode.isArray()) {
                        for (JsonNode musculoNode : musculosNode) {
                            String musculoDaVez = musculoNode.asText().toLowerCase();
                            List<Exercise> exerciciosDesteMusculo = todosOsExercicios.stream()
                                    .filter(ex -> ex.getGrupoMuscular() != null && ex.getGrupoMuscular().toLowerCase().contains(musculoDaVez))
                                    .collect(Collectors.toList());

                            List<Exercise> exerciciosFiltrados = aplicarRegraDeNivel(exerciciosDesteMusculo, nivel);

                            int quantidadeExerciciosPorMusculo = (objetivo.toLowerCase().contains("hipertrofia")) ? 3 : 2;
                            List<Exercise> sorteados = exerciciosFiltrados.stream()
                                    .limit(quantidadeExerciciosPorMusculo)
                                    .collect(Collectors.toList());

                            for (Exercise ex : sorteados) {
                                WorkoutExerciseRequest exReq = new WorkoutExerciseRequest();
                                exReq.setDiaSemana(diaSemana);
                                exReq.setNomeExercicio(ex.getNome());
                                exReq.setGrupoMuscular(musculoDaVez);
                                exReq.setSeries(4);
                                exReq.setRepeticoes(10);
                                exReq.setDescansoSegundos(60);
                                exReq.setObservacoes("Movimento controlado");

                                exerciseRequests.add(exReq);
                            }
                        }
                    }
                }
            }
            planRequest.setExercicios(exerciseRequests);

            WorkoutPlanResponse savedPlan = workoutPlanService.create(planRequest);

            return ResponseEntity.ok(savedPlan);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("erro", "Falha ao processar treino: " + e.getMessage()));
        }
    }

    private List<Exercise> aplicarRegraDeNivel(List<Exercise> exerciciosDoMusculo, String nivelUsuario) {
        List<Exercise> iniciantes = exerciciosDoMusculo.stream()
                .filter(ex -> ex.getNivelDificuldade() != null && ex.getNivelDificuldade().equalsIgnoreCase("iniciante"))
                .collect(Collectors.toList());

        List<Exercise> intermediarios = exerciciosDoMusculo.stream()
                .filter(ex -> ex.getNivelDificuldade() != null &&
                        (ex.getNivelDificuldade().equalsIgnoreCase("intermediário") || ex.getNivelDificuldade().equalsIgnoreCase("intermediario")))
                .collect(Collectors.toList());

        List<Exercise> avancados = exerciciosDoMusculo.stream()
                .filter(ex -> ex.getNivelDificuldade() != null &&
                        (ex.getNivelDificuldade().equalsIgnoreCase("avançado") || ex.getNivelDificuldade().equalsIgnoreCase("avancado")))
                .collect(Collectors.toList());

        java.util.Collections.shuffle(iniciantes);
        java.util.Collections.shuffle(intermediarios);
        java.util.Collections.shuffle(avancados);

        List<Exercise> resultado = new ArrayList<>();

        if (nivelUsuario.equalsIgnoreCase("Avançado") || nivelUsuario.equalsIgnoreCase("Avancado")) {
            resultado.addAll(avancados.stream().limit(2).collect(Collectors.toList()));
            resultado.addAll(intermediarios.stream().limit(1).collect(Collectors.toList()));
        } else if (nivelUsuario.equalsIgnoreCase("Iniciante")) {
            resultado.addAll(iniciantes.stream().limit(2).collect(Collectors.toList()));
            resultado.addAll(intermediarios.stream().limit(1).collect(Collectors.toList()));
        } else {
            resultado.addAll(intermediarios.stream().limit(2).collect(Collectors.toList()));
            resultado.addAll(iniciantes.stream().limit(1).collect(Collectors.toList()));
        }


        if (resultado.isEmpty()) {
            resultado.addAll(exerciciosDoMusculo);
        }

        java.util.Collections.shuffle(resultado);
        return resultado;
    }
    }