package com.kineo.backend.entity;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Streak {
    private LocalDate data;
    private Boolean treinou;
}