package com.kineo.backend.service;

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
}