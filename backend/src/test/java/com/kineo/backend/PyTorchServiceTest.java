package com.kineo.backend;

import com.kineo.backend.service.PyTorchService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PyTorchServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private PyTorchService pyTorchService;

    @Test
    void preverProximaCarga_shouldReturnResponseBodyOnSuccess() {
        ResponseEntity<Map> responseEntity = ResponseEntity.ok(Map.of("carga_sugerida", 52.5));
        when(restTemplate.postForEntity(anyString(), any(HttpEntity.class), eq(Map.class)))
                .thenReturn(responseEntity);

        Map<String, Object> resultado = pyTorchService.preverProximaCarga(50.0, 30, 10, 10, 0);

        assertThat(resultado).containsEntry("carga_sugerida", 52.5);
    }

    @Test
    void preverProximaCarga_shouldReturnErrorMapWhenExceptionThrown() {
        when(restTemplate.postForEntity(anyString(), any(HttpEntity.class), eq(Map.class)))
                .thenThrow(new RuntimeException("serviço fora"));

        Map<String, Object> resultado = pyTorchService.preverProximaCarga(50.0, 30, 10, 10, 0);

        assertThat(resultado).containsEntry("erro", "Microsserviço PyTorch offline.");
    }
}
