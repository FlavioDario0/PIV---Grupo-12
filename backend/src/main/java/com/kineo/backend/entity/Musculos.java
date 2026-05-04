package com.kineo.backend.entity;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import lombok.Data;
import java.util.List;

@Data
@Embeddable
public class Musculos {
    private String principal;

    @ElementCollection
    private List<String> secundarios;
}