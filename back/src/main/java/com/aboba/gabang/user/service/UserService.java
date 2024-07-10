package com.aboba.gabang.user.service;

import com.aboba.gabang.account.service.AccountService;
import com.aboba.gabang.user.dto.UserDto;
import com.aboba.gabang.user.dto.UserResponseAdminDto;
import com.aboba.gabang.user.dto.UserResponseDto;
import com.aboba.gabang.user.model.User;
import com.aboba.gabang.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final AccountService accountService;

    public Page<UserResponseAdminDto> findUsers(String role, String search, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);

        // 검색어 있는 경우
        if (search != null && !search.equals("null") && !search.equals("undefined")) {
            return userRepository.findUsersByUserIdContaining(search, pageRequest);
        }

        if (role.equals("admin")) {
            return userRepository.findAllAdminUsers(pageRequest);
        } else {
            return userRepository.findAllUsers(pageRequest);
        }
    }

//    public Page<UserResponseAdminDto> getAdminsByPage(int page, int size) {
//        PageRequest pageRequest = PageRequest.of(page, size);
//        return userRepository.findUsersByRole(pageRequest);
//    }

    @Transactional
    public User updateUser(String id, UserDto userDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("not found: " + id));

        String beforeAccount = user.getUserAccount();
        String beforeCDBankCode = user.getCdBankcode();

        user.update(userDto);


        accountService.editAccount(userDto.getUserAccount(), userDto.getCdBankcode(), beforeAccount, beforeCDBankCode);

        return user;
    }

    @Transactional
    public void deleteUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("not found: " + id));
        user.delete();

        accountService.deleteAccount(user.getUserAccount(), user.getCdBankcode());
    }

    public Optional<UserResponseDto> findUserResponseDtoByUserNameAndUserPhoneNumber(String userName, String userPhoneNumber) {
        Optional<UserResponseDto> findUserId = userRepository.findUserResponseDtoByUserNameAndUserPhoneNumberAndYnSecession(userName, userPhoneNumber, false);
        return findUserId;
    }

    public Optional<Boolean> existsByUserNameAndUserPhoneNumberAndUserId(String userName, String userPhoneNumber, String userId) {
        Optional<Boolean> exists = userRepository.existsByUserNameAndUserPhoneNumberAndUserIdAndYnSecession(userName, userPhoneNumber, userId, false);
        return exists;
    }

    public void signUp(UserDto userDto) {
        userDto.setUserPwd(bCryptPasswordEncoder.encode(userDto.getUserPwd()));
        User newUser = User.of(userDto.getUserId(), userDto.getUserPwd(), userDto.getUserName(), userDto.getUserPhoneNumber(), userDto.getUserBirthdate(), userDto.getCdBankcode(), userDto.getUserAccount(), LocalDateTime.now(ZoneId.of("Asia/Seoul")), false, false, "ROLE_USER");
        userRepository.save(newUser);
    }

    public void changePassword(String userId, UserDto userDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setUserPwd(bCryptPasswordEncoder.encode(userDto.getUserPwd()));

        userRepository.save(user);
    }

    public boolean isUserIdAvailable(String userId) {
        return userRepository.findById(userId).isEmpty();
    }

    public boolean isPhoneNumberAvailable(String phoneNumber) {
        return userRepository.countByUserPhoneNumberAndYnSecession(phoneNumber, false) == 0;
    }

    public Optional<UserResponseDto> findUserResponseDtoByUserIdAndYnSecession(String userId) {
        Optional<UserResponseDto> findUser = userRepository.findUserResponseDtoByUserIdAndYnSecession(userId, false);
        return findUser;
    }

    @Transactional
    public boolean checkAndChangePassword(String userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null || !bCryptPasswordEncoder.matches(currentPassword, user.getUserPwd())) {
            return false; // 유저가 존재하지 않거나 현재 비밀번호가 일치하지 않음
        }

        // 비밀번호 변경
        user.setUserPwd(bCryptPasswordEncoder.encode(newPassword));
        user.setUpdateDate(LocalDateTime.now());
        userRepository.save(user);
        return true;
    }
}
