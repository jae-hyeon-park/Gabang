package com.aboba.gabang.chat.dto;

import lombok.Data;

import java.util.List;

@Data
public class ChatRoomResponseDTO {
    private Integer roomId;
    private Integer productId;
    private String user1;
    private String user2;
    private List<ChatMessageResponseDTO> messages;
}
