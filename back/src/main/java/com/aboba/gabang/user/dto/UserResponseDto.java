package com.aboba.gabang.user.dto;

import jakarta.persistence.Column;
import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {
    private String userId;
    private String userName;
    private String userPhoneNumber;
    private LocalDateTime joinDate;
    private String cdBankcode;
    private String userAccount;
    private boolean ynInsurance;
}
