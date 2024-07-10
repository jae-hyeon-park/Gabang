package com.aboba.gabang.user.controller;

import com.aboba.gabang.account.service.AccountService;
import com.aboba.gabang.user.dto.UserDto;
import com.aboba.gabang.user.dto.UserResponseDto;
import com.aboba.gabang.user.model.User;
import com.aboba.gabang.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final AccountService accountService;

    @PostMapping("/users/find-id")
    public ResponseEntity<Optional<UserResponseDto>> findUserResponseDtoByUserNameAndUserPhoneNumber(@RequestBody User user) {
        String userName = user.getUserName();
        String userPhoneNumber = user.getUserPhoneNumber();
        Optional<UserResponseDto> findUser = userService.findUserResponseDtoByUserNameAndUserPhoneNumber(userName, userPhoneNumber);
        return ResponseEntity.ok(findUser);
    }

    @PostMapping("/users/find-pw")
    public ResponseEntity<Optional<Boolean>> existsByUserNameAndUserPhoneNumberAndUserId(@RequestBody User user) {
        String userName = user.getUserName();
        String userPhoneNumber = user.getUserPhoneNumber();
        String userId = user.getUserId();
        Optional<Boolean> exists = userService.existsByUserNameAndUserPhoneNumberAndUserId(userName, userPhoneNumber, userId);
        return ResponseEntity.ok(exists);
    }

    // 보통 boolean으로 return
    @PostMapping("/users/signup")
    public ResponseEntity<?> signUp(@RequestBody UserDto userDto) {
        try {
            userService.signUp(userDto);
            accountService.createAccount(userDto.getUserAccount(), userDto.getCdBankcode());
            return ResponseEntity.ok("Signup successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to signup");
        }
    }

    @PutMapping("/users/change-pw/{userId}")
    public ResponseEntity<?> changePassword(@PathVariable String userId, @RequestBody UserDto userDto) {
        try {
            userService.changePassword(userId, userDto); // userId 전달
            return ResponseEntity.ok("Password changed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to change password");
        }
    }

    @GetMapping("/users/check-id/{userId}")
    public boolean checkUserIdAvailability(@PathVariable String userId) {
       return userService.isUserIdAvailable(userId);
    }

    @GetMapping("/users/check-phone-number/{phoneNumber}")
    public boolean checkPhoneNumberAvailability(@PathVariable String phoneNumber) {
        return userService.isPhoneNumberAvailable(phoneNumber);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<Optional<UserResponseDto>> findUserResponseDtoByUserIdAndYnSecession(@PathVariable("userId") String userId) {
        Optional<UserResponseDto> findUser = userService.findUserResponseDtoByUserIdAndYnSecession(userId);
        return ResponseEntity.ok(findUser);
    }
}
