package com.aboba.gabang.user.model;

import com.aboba.gabang.user.model.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "suspension")
public class Suspension {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "suspension_id")
    private Integer suspensionId;

    @Column(name = "suspension_start", nullable = false)
    private LocalDateTime suspensionStart;

    @Column(name = "suspension_end", nullable = false)
    private LocalDateTime suspensionEnd;

    @Column(name = "suspension_count", nullable = false)
    private Integer suspensionCount;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", nullable = false)
    private User user;

    public Suspension(LocalDateTime suspensionStart, LocalDateTime suspensionEnd, Integer suspensionCount, User user) {
        this.suspensionStart = suspensionStart;
        this.suspensionEnd = suspensionEnd;
        this.suspensionCount = suspensionCount;
        this.user = user;
    }
}
