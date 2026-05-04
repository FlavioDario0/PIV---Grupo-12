package com.kineo.backend.dto;

import com.kineo.backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String nome;
    private String dataNascimento;
    private String email;
    private String objetivo;
    private String nivel;
    private Double altura;
    private Double peso;
    private String frequenciaTreinos;

    public static UserResponse fromEntity(User user) {
        return new UserResponse(
                user.getId(),
                user.getNome(),
                user.getDataNascimento(),
                user.getEmail(),
                user.getObjetivo(),
                user.getNivel(),
                user.getAltura(),
                user.getPeso(),
                user.getFrequenciaTreinos()
        );
    }
}