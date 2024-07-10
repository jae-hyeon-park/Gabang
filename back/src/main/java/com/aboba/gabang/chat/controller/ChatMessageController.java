package com.aboba.gabang.chat.controller;

import com.aboba.gabang.chat.dto.ChatMessageDTO;
import com.aboba.gabang.chat.model.ChatMessage;
import com.aboba.gabang.chat.service.ChatMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ChatMessageController {

    @Autowired
    private ChatMessageService chatMessageService;

    @GetMapping("/chat/messages")
    public ResponseEntity<?> getPreviousMessages(@RequestParam("roomId") Integer roomId) {
        List<ChatMessage> previousMessages = chatMessageService.getPreviousMessages(roomId);

        List<ChatMessageDTO> previousMessagesDTO = previousMessages.stream()
                                                    .map(ChatMessageDTO::fromEntity)
                                                    .toList();

        System.out.println(previousMessagesDTO);
        return ResponseEntity.ok(previousMessagesDTO);
    }
}