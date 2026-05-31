package com.kineo.backend.controller;

import com.kineo.backend.dto.AuthResponse;
import com.kineo.backend.dto.LoginRequest;
import com.kineo.backend.dto.RegisterRequest;
import com.kineo.backend.entity.User;
import com.kineo.backend.repository.UserRepository;
import com.kineo.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        AuthResponse authResponse = authService.login(request);
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            Map<String, Object> respostaCompleta = new HashMap<>();

            respostaCompleta.put("token", authResponse.getToken());

            respostaCompleta.put("id", user.getId());
            respostaCompleta.put("nome", user.getNome());
            respostaCompleta.put("email", user.getEmail());
            respostaCompleta.put("objetivo", user.getObjetivo());
            respostaCompleta.put("nivel", user.getNivel());
            respostaCompleta.put("frequenciaTreinos", user.getFrequenciaTreinos());

            return ResponseEntity.ok(respostaCompleta);
        }

        return ResponseEntity.status(401).body(Map.of("erro", "Utilizador não encontrado no banco de dados."));
    }
}