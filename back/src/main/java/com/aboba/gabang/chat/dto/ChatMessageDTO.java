package com.aboba.gabang.chat.dto;

import com.aboba.gabang.chat.model.ChatMessage;
import com.aboba.gabang.chat.model.Status;
import lombok.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Data
public class ChatMessageDTO {
    private String sender;
    private String receiver;
    private String contents;
    private LocalDateTime inputDate;
    private Integer productId;
    private Status status;
    private String messageType;

//    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    public static ChatMessageDTO fromEntity(ChatMessage chatMessage) {

        ChatMessageDTO chatMessageDTO = new ChatMessageDTO();
        chatMessageDTO.setSender(chatMessage.getSender().getUserId());
        chatMessageDTO.setContents(chatMessage.getContents());
//        chatMessageDTO.setInputDate(chatMessage.getInputDate().format(formatter));
        chatMessageDTO.setInputDate(chatMessage.getInputDate());
        chatMessageDTO.setMessageType(chatMessage.getMessageType());

        return chatMessageDTO;
    }

}