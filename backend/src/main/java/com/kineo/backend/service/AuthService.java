package com.kineo.backend.service;

import com.kineo.backend.dto.AuthResponse;
import com.kineo.backend.dto.LoginRequest;
import com.kineo.backend.dto.RegisterRequest;
import com.kineo.backend.dto.UserResponse;
import com.kineo.backend.entity.User;
import com.kineo.backend.repository.UserRepository;
import com.kineo.backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email já cadastrado");
        }

        User user = new User();

        user.setNome(request.getNome());
        user.setDataNascimento(request.getDataNascimento());
        user.setEmail(request.getEmail());
        user.setSenha(passwordEncoder.encode(request.getSenha()));
        user.setObjetivo(request.getObjetivo());
        user.setNivel(request.getNivel());
        user.setAltura(request.getAltura());
        user.setPeso(request.getPeso());
        user.setFrequenciaTreinos(request.getFrequenciaTreinos());

        User savedUser = userRepository.save(user);

        String token = jwtService.generateToken(savedUser);

        return new AuthResponse(token, UserResponse.fromEntity(savedUser));
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!passwordEncoder.matches(request.getSenha(), user.getSenha())) {
            throw new RuntimeException("Senha inválida");
        }

        String token = jwtService.generateToken(user);

        return new AuthResponse(token, UserResponse.fromEntity(user));
    }
}