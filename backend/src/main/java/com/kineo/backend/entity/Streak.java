package com.kineo.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(
        name = "streaks",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_id", "data"})
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Streak {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate data;

    private Boolean treinou;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}