package com.aboba.gabang.account.service;

import com.aboba.gabang.account.model.Account;
import com.aboba.gabang.account.repository.AccountRepository;
import com.aboba.gabang.product.dto.ProductResponseAccountDTO;
import com.aboba.gabang.product.repository.ProductRepository;
import com.aboba.gabang.user.model.User;
import com.aboba.gabang.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;


    public String checkAccount (Integer productPrice, User buyer){ //결제시 user의 계좌에서 금액 빼기
        Optional<Account> optAccount = accountRepository.findAccountByBankCodeAndUserAccount(buyer.getCdBankcode(), buyer.getUserAccount());

        if(optAccount.isPresent()) {
            Account account = optAccount.get();
            // 잔액을 확인하고 금액 빼기
            int balance = account.getBalance();
            if(balance >= productPrice) {
                account.setBalance(balance - productPrice);
                accountRepository.save(account);
                return "결제완료";
            } else {
                return "잔액부족";
            }
        } else {
            return "해당 계좌없음";
        }
    }


    public String deposit(Integer productId){ //입금
        Optional<ProductResponseAccountDTO> optProduct = productRepository.findByProductId2(productId);
        ProductResponseAccountDTO p = optProduct.get();

        Optional<User> optUser = userRepository.findById(p.getSellerId());
        User u = optUser.get();

        Optional<Account> optAccount = accountRepository.findAccountByBankCodeAndUserAccount(u.getCdBankcode(), u.getUserAccount());

        if(optAccount.isPresent()) {
            Account account = optAccount.get();
            int balance = account.getBalance();
            account.setBalance(balance + p.getProductPrice());
            accountRepository.save(account);
            return "입급 성공";
        } else {
            return "해당 계좌없음";
        }

    }

    public void deposit(String cdBankcode, String userAccount, Integer amount) {
        Optional<Account> optAccount = accountRepository.findAccountByBankCodeAndUserAccount(cdBankcode, userAccount);
        if (optAccount.isPresent()) {
            Account account = optAccount.get();
            account.setBalance(account.getBalance() + amount);
        }
    }

    public String createAccount(String userAccount, String cdBankCode){
        Account account = Account.builder().userAccount(userAccount).cdBankcode(cdBankCode).balance(100000).build();

        accountRepository.save(account);
        return "계좌생성완료";
    }

    public String deleteAccount(String userAccount, String cdBankCode){
        Optional<Account> opt = accountRepository.findAccountByBankCodeAndUserAccount(cdBankCode, userAccount);

        accountRepository.delete(opt.get());
        return "계좌 제거 완료";
    }

    public String editAccount(String userAccount, String cdBankCode, String beforeUserAccount, String beforeCDBank){

        Optional<Account> opt = accountRepository.findAccountByBankCodeAndUserAccount(beforeCDBank, beforeUserAccount);

        Account account = opt.get();
        account.setUserAccount(userAccount);
        account.setCdBankcode(cdBankCode);
        accountRepository.save(account);

        return "계좌 수정 완료";
    }

}
