package com.aboba.gabang.chat.controller;

import com.aboba.gabang.chat.dto.ChatMessageDTO;
import com.aboba.gabang.chat.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    @Autowired
    private ChatService chatService;

    @MessageMapping("/message") /// /app/message
    @SendTo("/chat/private")
    public ChatMessageDTO receiveMessage(@Payload ChatMessageDTO message){
        System.out.println("전");
        System.out.println(message.toString());
        chatService.saveChatMessage(message);
        System.out.println("후");
        System.out.println(message.toString());

        simpMessagingTemplate.convertAndSend("/chat/list", message);

        String receiverId = message.getReceiver();
        simpMessagingTemplate.convertAndSendToUser(receiverId, "/chat/notification", message);
        return message;
    }
}