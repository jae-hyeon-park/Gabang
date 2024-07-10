package com.aboba.gabang.user.dto;

import com.aboba.gabang.user.model.Suspension;
import com.aboba.gabang.user.model.User;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Getter
public class SuspensionRequestDto {

    private String suspensionStart;

    private String suspensionEnd;

    private Integer suspensionCount;

    private String userId;

    public Suspension toEntity(User user) {
        LocalDate start = LocalDate.parse(this.suspensionStart, DateTimeFormatter.ISO_DATE);
        LocalDate end = LocalDate.parse(this.suspensionEnd, DateTimeFormatter.ISO_DATE);

        LocalDateTime startDateTime = start.atTime(LocalTime.MIN);
        LocalDateTime endDateTime = end.atTime(LocalTime.MIN);

        return new Suspension(startDateTime, endDateTime, suspensionCount, user);
    }
}
