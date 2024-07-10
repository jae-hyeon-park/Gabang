package com.aboba.gabang.user.model;

import com.aboba.gabang.user.dto.UserDto;
import com.aboba.gabang.user.service.SuspensionService;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "user")
public class User {
    @Id
    @Column(name = "user_id", length = 20, nullable = false)
    private String userId;

    @Column(name = "user_pwd", length = 100, nullable = false)
    private String userPwd;

    @Column(name = "user_name", length = 30, nullable = false)
    private String userName;

    @Column(name = "user_phonenumber", length = 11, nullable = false)
    private String userPhoneNumber;

    @Column(name = "user_birthdate", length = 8, nullable = false)
    private String userBirthdate;

    @Column(name = "user_account", length = 50, nullable = false)
    private String userAccount;

    @Column(name = "cd_bankcode", length = 2, nullable = false)
    private String cdBankcode;

    @Column(name = "joindate", nullable = false)
    private LocalDateTime joinDate;

    @Column(name = "updatedate")
    private LocalDateTime updateDate;

    @Column(name = "yn_insurance", nullable = false)
    private boolean ynInsurance;

    @Column(name = "insurance_start")
    private LocalDateTime insuranceStart;

    @Column(name = "insurance_end")
    private LocalDateTime insuranceEnd;

    @Column(name = "yn_secession", nullable = false)
    private boolean ynSecession;

    @Column(name = "role", nullable = false)
    private String role;

    @OneToMany(mappedBy = "user")
    private List<Suspension> suspensions;

    public void update(UserDto dto) {
        this.cdBankcode = dto.getCdBankcode();
        this.userAccount = dto.getUserAccount();
        this.updateDate = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
    }

    public void delete() {
        this.ynSecession = true;
        this.updateDate = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
    }

    public static User of(String userId, String userPwd, String userName, String userPhoneNumber, String userBirthdate,
                          String cdBankcode, String userAccount, LocalDateTime joinDate, boolean ynInsurance,
                          boolean yn_secession, String role)
    {
        return User.builder()
                .userId(userId)
                .userPwd(userPwd)
                .userName(userName)
                .userPhoneNumber(userPhoneNumber)
                .userBirthdate(userBirthdate)
                .cdBankcode(cdBankcode)
                .userAccount(userAccount)
                .joinDate(joinDate)
                .ynInsurance(ynInsurance)
                .ynSecession(yn_secession)
                .role(role)
                .build();
    }
}