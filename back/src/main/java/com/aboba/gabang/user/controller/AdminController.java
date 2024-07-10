package com.aboba.gabang.user.controller;

import com.aboba.gabang.user.dto.UserDto;
import com.aboba.gabang.user.dto.UserResponseAdminDto;
import com.aboba.gabang.user.dto.UserResponseDto;
import com.aboba.gabang.user.model.User;
import com.aboba.gabang.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;

    @GetMapping("/users")
    public Page<UserResponseAdminDto> findUsers(
            @RequestParam(defaultValue = "user") String role,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        return userService.findUsers(role, search, page, size);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable("id") String id, @RequestBody UserDto userDto) {
        User updatedUser = userService.updateUser(id, userDto);
        return ResponseEntity.ok()
                .body(updatedUser);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable("id") String id) {
        userService.deleteUser(id);
        return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
    }

    @PutMapping("/pwd-change/{userId}")
    public ResponseEntity<String> changePassword(@PathVariable String userId, @RequestBody Map<String, String> request) {
        String pwd = request.get("pwd");
        String newPwd = request.get("newPwd");
        boolean success = userService.checkAndChangePassword(userId, pwd, newPwd);
        if (success) {
            return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("현재 비밀번호가 일치하지 않습니다.");
        }
    }
}
