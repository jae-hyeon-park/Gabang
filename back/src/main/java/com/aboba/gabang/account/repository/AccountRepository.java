package com.aboba.gabang.account.repository;

import com.aboba.gabang.account.model.Account;
import com.aboba.gabang.product.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Integer> {
    @Query("SELECT a FROM Account a WHERE a.cdBankcode = :cdBankcode AND a.userAccount = :userAccount")
    Optional<Account> findAccountByBankCodeAndUserAccount(
            @Param("cdBankcode") String cdBankcode,
            @Param("userAccount") String userAccount
    );
}
