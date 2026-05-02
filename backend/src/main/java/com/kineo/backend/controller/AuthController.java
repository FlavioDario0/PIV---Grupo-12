package com.kineo.backend.controller;

import com.kineo.backend.dto.LoginRequest;
import com.kineo.backend.dto.RegisterRequest;
import com.kineo.backend.entity.User;
import com.kineo.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest request) {
        User user = authService.register(request);
        return ResponseEntity.ok(user);
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // Supondo que você já criou um método 'login' no seu AuthService
            User user = authService.login(request);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            // Se a senha estiver errada ou o e-mail não existir, devolve erro 400
            return ResponseEntity.badRequest().body("E-mail ou senha incorretos");
        }
    }
    // ------------------------------------
}
