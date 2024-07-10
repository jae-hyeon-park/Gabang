package com.aboba.gabang.chat.service;

import com.aboba.gabang.chat.dto.ChatMessageResponseDTO;
import com.aboba.gabang.chat.dto.ChatRoomResponseDTO;
import com.aboba.gabang.chat.model.ChatMessage;
import com.aboba.gabang.chat.model.ChatRoom;
import com.aboba.gabang.chat.repository.ChatMessageRepository;
import com.aboba.gabang.chat.repository.ChatRoomRepository;
import com.aboba.gabang.product.repository.ProductRepository;
import com.aboba.gabang.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class ChatRoomService {

    @Autowired
    private ChatRoomRepository chatRoomRepository;
    @Autowired
    private ChatMessageRepository chatMessageRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserRepository userRepository;

    public ChatRoom findExistingChatRoom(Integer productId, String user1, String user2) {
        return chatRoomRepository.findExistingChatRoom(productId, user1, user2);
    }

    public List<ChatRoomResponseDTO> getChatListWithMessages(String userId) {
        List<ChatRoom> chatRooms = chatRoomRepository.findAllByUser1IdOrUser2Id(userId, userId);
        List<ChatRoomResponseDTO> chatRoomResponseDTOs = new ArrayList<>();

        // 각 채팅 방에 대한 메시지 정보 조회
        for (ChatRoom chatRoom : chatRooms) {
            List<ChatMessage> messages = chatMessageRepository.findByRoomId(chatRoom.getRoomId());

            ChatRoomResponseDTO chatRoomResponseDTO = new ChatRoomResponseDTO();
            chatRoomResponseDTO.setRoomId(chatRoom.getRoomId());
            chatRoomResponseDTO.setProductId(chatRoom.getProduct().getProductId());
            chatRoomResponseDTO.setUser1(chatRoom.getUser1().getUserId());
            chatRoomResponseDTO.setUser2(chatRoom.getUser2().getUserId());

            List<ChatMessageResponseDTO> chatMessageResponseDTOs = new ArrayList<>();
            for (ChatMessage message : messages) {
                ChatMessageResponseDTO messageResponseDTO = new ChatMessageResponseDTO();
                messageResponseDTO.setChatId(message.getChatId());
                messageResponseDTO.setContents(message.getContents());
                messageResponseDTO.setSender(message.getSender().getUserId());
                messageResponseDTO.setSenderRole(message.getSender().getRole());
                messageResponseDTO.setInputDate(message.getInputDate());
                messageResponseDTO.setRoomId(message.getChatRoom().getRoomId());
                messageResponseDTO.setMessageType(message.getMessageType());
                chatMessageResponseDTOs.add(messageResponseDTO);
            }

            chatRoomResponseDTO.setMessages(chatMessageResponseDTOs);
            chatRoomResponseDTOs.add(chatRoomResponseDTO);
        }

        return chatRoomResponseDTOs;
    }











//    public ChatRoom createChatRoom(ChatRoomRequestDTO chatRoomRequestDTO) {
//        Integer productId = chatRoomRequestDTO.getProductId();
//        String user1Id = chatRoomRequestDTO.getUser1();
//        String user2Id = chatRoomRequestDTO.getUser2();
//
//        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));
//        User user1 = userRepository.findById(user1Id).orElseThrow(() -> new RuntimeException("User 1 not found"));
//        User user2 = userRepository.findById(user2Id).orElseThrow(() -> new RuntimeException("User 2 not found"));
//
//        ChatRoom chatRoom = new ChatRoom();
//        chatRoom.setProduct(product);
//        chatRoom.setUser1(user1);
//        chatRoom.setUser2(user2);
//
//        return chatRoomRepository.save(chatRoom);
//    }
}
