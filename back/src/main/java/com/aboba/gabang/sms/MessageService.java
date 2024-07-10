package com.aboba.gabang.sms;
import jakarta.annotation.PostConstruct;
import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.model.MessageType;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.response.SingleMessageSentResponse;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class MessageService {

    DefaultMessageService messageService;
    private final Map<String, String> verificationCodes = new HashMap<>();
    @Value("${spring.sms.apiKey}")
    private String apiKey;

    @Value("${spring.sms.apiSecretKey}")
    private String apiSecret;

    @Value("${spring.sms.fromNumber}")
    private String fromNumber;

    @PostConstruct
    public void init() {
        this.messageService = NurigoApp.INSTANCE.initialize(apiKey, apiSecret, "https://api.coolsms.co.kr");
    }

    public void sendMessage(@RequestParam String toNumber,
                            @RequestParam String verificationCode) {

        Message message = new Message();
        message.setFrom(fromNumber);
        message.setTo(toNumber);
        message.setType(MessageType.SMS);
        message.setText("[GABANG] 인증번호 " + verificationCode + " 를 입력하세요.");

        verificationCodes.put(toNumber, verificationCode);

        SingleMessageSendingRequest request = new SingleMessageSendingRequest(message);
        SingleMessageSentResponse response = this.messageService.sendOne(request);
        System.out.println(response);
    }

    public boolean verifyCode(String phoneNumber, String code) {
        String storedCode = verificationCodes.getOrDefault(phoneNumber, "");
        return storedCode.equals(code);
    }
}
