package com.aboba.gabang.chat.repository;

import com.aboba.gabang.chat.model.ChatMessage;
import com.aboba.gabang.chat.model.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Integer> {

    @Query("SELECT cm FROM ChatMessage cm WHERE cm.chatRoom.roomId = :roomId")
    List<ChatMessage> findByRoomId(Integer roomId);

    List<ChatMessage> findByChatRoom(ChatRoom chatRoom);

}