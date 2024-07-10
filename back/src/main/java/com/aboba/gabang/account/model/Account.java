package com.aboba.gabang.account.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "account")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "account_id")
    private Integer accountId;

    @Column(name = "cd_bankcode", length = 2, nullable = false)
    private String cdBankcode;

    @Column(name = "user_account", length = 50, nullable = false)
    private String userAccount;

    @Column(name = "balance", nullable = false)
    private Integer balance;

    // Getters and setters
}
