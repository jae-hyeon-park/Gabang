package com.aboba.gabang.sms;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Random;
@RestController
public class SMSController {

    private final MessageService messageService;

    public SMSController(MessageService messageService) {
        this.messageService = messageService;
    }

    // 랜덤 숫자 생성
    private String generateVerificationCode() {
        Random random = new Random();
        int code = random.nextInt(900000) + 100000;
        return String.valueOf(code);
    }

    @PostMapping("/sendCode")
    public ResponseEntity<String> sendVerificationCode(@RequestBody Map<String, String> payload) {
        String phoneNumber = payload.get("phoneNumber");
        String verificationCode = generateVerificationCode();
        messageService.sendMessage(phoneNumber, verificationCode);
        return ResponseEntity.ok("인증번호가 전송되었습니다.");
    }

    @PostMapping("/verifyCode")
    public ResponseEntity<String> verifyCode(@RequestBody Map<String, String> payload) {
        String phoneNumber = payload.get("phoneNumber");
        String verificationCode = payload.get("verificationCode");

        boolean isValid = messageService.verifyCode(phoneNumber, verificationCode);

        if (isValid) {
            return ResponseEntity.ok("인증 성공");
        } else {
            return ResponseEntity.badRequest().body("인증 실패");
        }
    }
}

