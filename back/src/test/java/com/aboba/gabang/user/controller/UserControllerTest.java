package com.aboba.gabang.user.controller;

import com.aboba.gabang.user.dto.UserDto;
import com.aboba.gabang.user.dto.UserResponseDto;
import com.aboba.gabang.user.model.User;
import com.aboba.gabang.user.service.UserService;
import com.aboba.gabang.account.service.AccountService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private AccountService accountService;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    void testFindUserResponseDtoByUserNameAndUserPhoneNumber() {
        // Arrange
        User user = new User();
        user.setUserName("testUser");
        user.setUserPhoneNumber("1234567890");
        Optional<UserResponseDto> userResponseDto = Optional.of(new UserResponseDto());

        when(userService.findUserResponseDtoByUserNameAndUserPhoneNumber("testUser", "1234567890")).thenReturn(userResponseDto);

        // Act
        ResponseEntity<Optional<UserResponseDto>> responseEntity = userController.findUserResponseDtoByUserNameAndUserPhoneNumber(user);

        // Assert
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(userResponseDto, responseEntity.getBody());
    }

    @Test
    void testExistsByUserNameAndUserPhoneNumberAndUserId() {
        // Arrange
        User user = new User();
        user.setUserName("testUser");
        user.setUserPhoneNumber("1234567890");
        user.setUserId("testUserId");
        Optional<Boolean> exists = Optional.of(true);

        when(userService.existsByUserNameAndUserPhoneNumberAndUserId("testUser", "1234567890", "testUserId")).thenReturn(exists);

        // Act
        ResponseEntity<Optional<Boolean>> responseEntity = userController.existsByUserNameAndUserPhoneNumberAndUserId(user);

        // Assert
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(exists, responseEntity.getBody());
    }

    @Test
    void testCheckUserIdAvailability() {
        // Arrange
        String userId = "testUserId";

        when(userService.isUserIdAvailable(userId)).thenReturn(true);

        // Act
        boolean isAvailable = userController.checkUserIdAvailability(userId);

        // Assert
        assertTrue(isAvailable);
    }

    @Test
    void testCheckPhoneNumberAvailability() {
        // Arrange
        String phoneNumber = "1234567890";

        when(userService.isPhoneNumberAvailable(phoneNumber)).thenReturn(true);

        // Act
        boolean isAvailable = userController.checkPhoneNumberAvailability(phoneNumber);

        // Assert
        assertTrue(isAvailable);
    }


    @Test
    void testFindUserResponseDtoByUserIdAndYnSecession() {
        // Arrange
        String userId = "testUserId";
        Optional<UserResponseDto> userResponseDto = Optional.of(new UserResponseDto());

        when(userService.findUserResponseDtoByUserIdAndYnSecession(userId)).thenReturn(userResponseDto);

        // Act
        ResponseEntity<Optional<UserResponseDto>> responseEntity = userController.findUserResponseDtoByUserIdAndYnSecession(userId);

        // Assert
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(userResponseDto, responseEntity.getBody());
    }
}
