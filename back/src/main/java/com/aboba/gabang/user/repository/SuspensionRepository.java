package com.aboba.gabang.user.repository;

import com.aboba.gabang.user.model.Suspension;
import com.aboba.gabang.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SuspensionRepository extends JpaRepository<Suspension, Integer> {

    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END " +
            "FROM Suspension s " +
            "JOIN s.user u " +
            "WHERE u.userPhoneNumber = :phoneNumber " +
            "AND s.suspensionStart <= CURRENT_TIMESTAMP " +
            "AND s.suspensionEnd >= CURRENT_TIMESTAMP " +
            "AND s.suspensionId = (SELECT MAX(s2.suspensionId) FROM Suspension s2 WHERE s2.user = u)")
    boolean existsSuspensionsByUserPhoneNumber(@Param("phoneNumber") String phoneNumber);

    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END FROM Suspension s WHERE s.user.userId = :userId AND s.suspensionStart <= CURRENT_TIMESTAMP AND s.suspensionEnd >= CURRENT_TIMESTAMP AND s.suspensionId = (SELECT MAX(s2.suspensionId) FROM Suspension s2 WHERE s2.user.userId = :userId)")
    boolean existsSuspensionsByUserId(@Param("userId") String userId);

}
