package com.kineo.backend;

import com.kineo.backend.service.AiService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AiServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private AiService aiService;

    @Test
    void perguntarAoOllama_shouldReturnResponseWhenApiReturnsResponseKey() {
        when(restTemplate.postForObject(anyString(), any(), eq(Map.class)))
                .thenReturn(Map.of("response", "Olá, essa é a IA."));

        String resposta = aiService.perguntarAoOllama("Qual é o melhor treino?", false);

        assertThat(resposta).isEqualTo("Olá, essa é a IA.");
    }

    @Test
    void perguntarAoOllama_shouldReturnFallbackWhenResponseMissing() {
        when(restTemplate.postForObject(anyString(), any(), eq(Map.class)))
                .thenReturn(Map.of("message", "Sem resposta"));

        String resposta = aiService.perguntarAoOllama("Qual é o melhor treino?", true);

        assertThat(resposta).isEqualTo("Desculpe, não consegui formular uma resposta.");
    }

    @Test
    void perguntarAoOllama_shouldReturnErrorMessageWhenExceptionThrown() {
        when(restTemplate.postForObject(anyString(), any(), eq(Map.class)))
                .thenThrow(new RuntimeException("conexão falhou"));

        String resposta = aiService.perguntarAoOllama("Qual é o melhor treino?", false);

        assertThat(resposta).isEqualTo("Erro ao conectar com Ollama");
    }
}
