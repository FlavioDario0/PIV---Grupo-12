package com.kineo.backend.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class PyTorchService {

    private final RestTemplate restTemplate;

    public PyTorchService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // A MUDANÇA ESTÁ AQUI: Adicionámos o int falhasConsecutivas
    public Map<String, Object> preverProximaCarga(double cargaAtual, int diasTreinados, int metaReps, int repsFeitas, int falhasConsecutivas) {

        String pythonMicroserviceUrl = "http://localhost:8000/prever";

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("carga_atual", cargaAtual);
        requestBody.put("dias_treinados", diasTreinados);
        requestBody.put("meta_reps", metaReps);
        requestBody.put("reps_feitas", repsFeitas);
        requestBody.put("falhas_consecutivas", falhasConsecutivas); // Enviando o 5º parâmetro!

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(pythonMicroserviceUrl, request, Map.class);
            return response.getBody();
        } catch (Exception e) {
            Map<String, Object> erro = new HashMap<>();
            erro.put("erro", "Microsserviço PyTorch offline.");
            return erro;
        }
    }
}