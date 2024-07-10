package com.aboba.gabang.chat.service;

import com.aboba.gabang.chat.dto.ChatMessageDTO;
import com.aboba.gabang.chat.model.ChatMessage;
import com.aboba.gabang.chat.model.ChatRoom;
import com.aboba.gabang.chat.repository.ChatMessageRepository;
import com.aboba.gabang.chat.repository.ChatRoomRepository;
import com.aboba.gabang.product.model.Product;
import com.aboba.gabang.product.repository.ProductRepository;
import com.aboba.gabang.user.model.User;
import com.aboba.gabang.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.DateTimeFormatter;

@Service
public class ChatService {
    @Autowired
    private ChatRoomRepository chatRoomRepository;
    @Autowired
    private ChatMessageRepository chatMessageRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    public void saveChatMessage(ChatMessageDTO chatMessageDTO) {
        Integer productId = chatMessageDTO.getProductId();
        String senderId = chatMessageDTO.getSender();
        String receiverId = chatMessageDTO.getReceiver();


        // 채팅방 찾기 또는 생성
        ChatRoom chatRoom = findOrCreateChatRoom(productId, senderId, receiverId);
        User sender = userRepository.findById(senderId).orElseThrow();

        // 채팅 메시지 저장
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setContents(chatMessageDTO.getContents());
        chatMessage.setSender(sender);
        chatMessage.setChatRoom(chatRoom);
        chatMessage.setInputDate(chatMessageDTO.getInputDate());
        
        chatMessageRepository.save(chatMessage);
    }

    public ChatRoom findOrCreateChatRoom(Integer productId, String senderId, String receiverId) {

        ChatRoom existingChatRoom = chatRoomRepository.findExistingChatRoom(productId, senderId, receiverId);

        if (existingChatRoom != null) {
            return existingChatRoom;
        }  else {
            Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));
            User user1 = userRepository.findById(senderId).orElseThrow(() -> new RuntimeException("User 1 not found"));
            User user2 = userRepository.findById(receiverId).orElseThrow(() -> new RuntimeException("User 2 not found"));

            ChatRoom newChatRoom = new ChatRoom();
            newChatRoom.setProduct(product);
            newChatRoom.setUser1(user1);
            newChatRoom.setUser2(user2);

            return chatRoomRepository.save(newChatRoom);
        }
    }
}