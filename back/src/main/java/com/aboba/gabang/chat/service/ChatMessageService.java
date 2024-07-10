package com.aboba.gabang.chat.service;

import com.aboba.gabang.chat.model.ChatMessage;
import com.aboba.gabang.chat.model.ChatRoom;
import com.aboba.gabang.chat.repository.ChatMessageRepository;
import com.aboba.gabang.user.model.User;
import com.aboba.gabang.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
public class ChatMessageService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;
    private UserRepository userRepository;

    public List<ChatMessage> getPreviousMessages(Integer roomId) {
        return chatMessageRepository.findByRoomId(roomId);
    }

    public void sendDecisionRequestMessage(String contents, User buyer, ChatRoom chatRoom) {
        LocalDateTime inputDate = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
        System.out.println(inputDate);

        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setContents(contents);
        chatMessage.setSender(buyer);
        chatMessage.setChatRoom(chatRoom);
        chatMessage.setInputDate(inputDate);
        chatMessage.setMessageType("decision");

        chatMessageRepository.save(chatMessage);
    }
}
