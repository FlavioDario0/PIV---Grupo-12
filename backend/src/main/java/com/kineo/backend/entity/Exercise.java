package com.kineo.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "exercises")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 1000)
    private String nome;

    @Column(columnDefinition = "LONGTEXT")
    private String descricao;

    private String grupoMuscular;
    private String equipamentos;
    private String nivelDificuldade;

    @Column(length = 1000)
    private String errosComuns;
}