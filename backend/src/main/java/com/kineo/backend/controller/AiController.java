package com.kineo.backend.controller;

import com.kineo.backend.service.AiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/chat")
@CrossOrigin("*")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/perguntar")
    public ResponseEntity<Map<String, String>> perguntar(@RequestBody Map<String, String> request) {
        String pergunta = request.get("pergunta");


        String promptContexto = "Aja como um personal trainer especialista e educado. Responda de forma curta e direta a seguinte dúvida: " + pergunta;

        String respostaDaIA = aiService.perguntarAoOllama(promptContexto);


        return ResponseEntity.ok(Map.of("resposta", respostaDaIA));
    }
}