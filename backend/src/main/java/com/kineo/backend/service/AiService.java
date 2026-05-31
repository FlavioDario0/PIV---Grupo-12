package com.kineo.backend.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class AiService {

    private final RestTemplate restTemplate;
    private final String OLLAMA_URL = "http://localhost:11434/api/generate";

    public AiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String perguntarAoOllama(String perguntaUsuario, boolean forcarJson) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new HashMap<>();
        body.put("model", "llama3");
        body.put("prompt", perguntaUsuario);
        body.put("stream", false);

        Map<String, Object> options = new HashMap<>();


        if (forcarJson) {
            body.put("format", "json");
            options.put("num_predict", 2048);
            options.put("temperature", 0.2);
        } else {

            options.put("temperature", 0.7);
        }

        body.put("options", options);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            Map<String, Object> resposta = restTemplate.postForObject(OLLAMA_URL, request, Map.class);
            if (resposta != null && resposta.containsKey("response")) {
                return resposta.get("response").toString();
            }
            return "Desculpe, não consegui formular uma resposta.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Erro ao conectar com Ollama";
        }
    }
}