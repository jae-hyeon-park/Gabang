package com.aboba.gabang.chat.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChatMessageResponseDTO {
    private Integer chatId;
    private String contents;
    private String sender;
    private String senderRole;
    private LocalDateTime inputDate;
    private Integer roomId;
    private String messageType;
}