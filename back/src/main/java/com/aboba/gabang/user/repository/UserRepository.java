package com.aboba.gabang.user.repository;

import com.aboba.gabang.user.dto.UserResponseAdminDto;
import com.aboba.gabang.user.dto.UserResponseDto;
import com.aboba.gabang.user.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {

    @Query("SELECT NEW com.aboba.gabang.user.dto.UserResponseAdminDto(u) FROM User u WHERE u.ynSecession = false ORDER BY joinDate DESC")
    Page<UserResponseAdminDto> findAllUsers(Pageable pageable);

    @Query("SELECT NEW com.aboba.gabang.user.dto.UserResponseAdminDto(u) FROM User u WHERE u.role = 'ROLE_ADMIN' AND u.ynSecession = false ORDER BY joinDate DESC")
    Page<UserResponseAdminDto> findAllAdminUsers(Pageable pageable);

    @Query("SELECT NEW com.aboba.gabang.user.dto.UserResponseAdminDto(u) FROM User u WHERE u.userId LIKE CONCAT('%', :searchKeyword, '%') AND u.ynSecession = false")
    Page<UserResponseAdminDto> findUsersByUserIdContaining(String searchKeyword, Pageable pageable);

    @Query("SELECT NEW com.aboba.gabang.user.dto.UserResponseDto(u.userId, u.userName, u.userPhoneNumber, u.joinDate, u.cdBankcode, u.userAccount, u.ynInsurance) FROM User u WHERE u.userName = :userName AND u.userPhoneNumber = :userPhoneNumber AND u.ynSecession = :ynSecession")
    Optional<UserResponseDto> findUserResponseDtoByUserNameAndUserPhoneNumberAndYnSecession(@Param("userName") String userName, @Param("userPhoneNumber") String userPhoneNumber, @Param("ynSecession") boolean ynSecession);

    Optional<Boolean> existsByUserNameAndUserPhoneNumberAndUserIdAndYnSecession(String userName, String userPhoneNumber, String userId, boolean ynSecession);

    Long countByUserPhoneNumberAndYnSecession(String phoneNumber, boolean ynSecession);

    @Query("SELECT NEW com.aboba.gabang.user.dto.UserResponseDto(u.userId, u.userName, u.userPhoneNumber, u.joinDate, u.cdBankcode, u.userAccount, u.ynInsurance) FROM User u WHERE u.userId = :userId AND u.ynSecession = :ynSecession")
    Optional<UserResponseDto> findUserResponseDtoByUserIdAndYnSecession(@Param("userId") String userId, @Param("ynSecession") boolean ynSecession);

    User findByUserIdAndYnSecession(String username, boolean ynSecession);
}
