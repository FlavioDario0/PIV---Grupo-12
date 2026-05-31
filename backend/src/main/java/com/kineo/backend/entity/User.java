package com.kineo.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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