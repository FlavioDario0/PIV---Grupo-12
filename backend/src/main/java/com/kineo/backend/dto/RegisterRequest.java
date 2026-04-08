package com.kineo.backend.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String nome;
    private String dataNascimento;
    private String email;
    private String senha;
    private String objetivo;
    private String nivel;
    private Double altura;
    private Double peso;
    private String frequenciaTreinos;
}