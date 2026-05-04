package com.kineo.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
@Table(name = "exercises")
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @ElementCollection
    private List<String> imagens;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    private String equipamentos;

    @ElementCollection
    private List<String> niveis;

    @Embedded
    private Musculos musculos;

    @ElementCollection
    private List<String> erros;
}