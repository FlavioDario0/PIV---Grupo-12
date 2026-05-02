package com.kineo.backend.service;

import com.kineo.backend.dto.LoginRequest;
import com.kineo.backend.dto.RegisterRequest;
import com.kineo.backend.entity.User;
import com.kineo.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(RegisterRequest request) {
        User user = new User();

        user.setNome(request.getNome());
        user.setDataNascimento(request.getDataNascimento());
        user.setEmail(request.getEmail());
        user.setSenha(request.getSenha());
        user.setObjetivo(request.getObjetivo());
        user.setNivel(request.getNivel());
        user.setAltura(request.getAltura());
        user.setPeso(request.getPeso());
        user.setFrequenciaTreinos(request.getFrequenciaTreinos());

        return userRepository.save(user);
    }
    public User login(LoginRequest request) {
        // Busca o e-mail no banco
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("E-mail não cadastrado"));

        // Verifica a senha (se o nome da variável no seu User for senha, use getSenha())
        if (!user.getSenha().equals(request.getSenha())) {
            throw new RuntimeException("Senha incorreta");
        }

        return user;
    }
}