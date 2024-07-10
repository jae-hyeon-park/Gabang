package com.aboba.gabang.user.dto;

import com.aboba.gabang.user.model.Suspension;
import com.aboba.gabang.user.model.User;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private String userId;
    private String userPwd;
    private String userName;
    private String userPhoneNumber;
    private String userBirthdate;
    private String cdBankcode;
    private String userAccount;
    private LocalDateTime joinDate;
    private LocalDateTime updateDate;

    public UserDto(User user) {
        this.userId = user.getUserId();
        this.userPwd = user.getUserPwd();
        this.userName = user.getUserName();
        this.userPhoneNumber = user.getUserPhoneNumber();
        this.userBirthdate = user.getUserBirthdate();
        this.cdBankcode = user.getCdBankcode();
        this.userAccount = user.getUserAccount();
        this.joinDate = user.getJoinDate();
        this.updateDate = user.getUpdateDate();
    }
}
