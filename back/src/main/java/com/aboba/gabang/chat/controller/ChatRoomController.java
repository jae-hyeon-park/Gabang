package com.aboba.gabang.chat.controller;

import com.aboba.gabang.chat.dto.ChatRoomResponseDTO;
import com.aboba.gabang.chat.model.ChatRoom;
import com.aboba.gabang.chat.service.ChatRoomService;
import com.aboba.gabang.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class ChatRoomController {

    @Autowired
    private ChatRoomService chatRoomService;

    @Autowired
    private UserService userService;

    @GetMapping("/chat/room")
    public ResponseEntity<?> checkChatRoom (@RequestParam("productId") Integer productId,
                                            @RequestParam("user1") String user1,
                                            @RequestParam("user2") String user2) {

        ChatRoom existingRoom = chatRoomService.findExistingChatRoom(productId, user1, user2);
        if (existingRoom != null) {
            return ResponseEntity.ok().body(Map.of("exist", true, "roomId", existingRoom.getRoomId()));
        } else {
            return ResponseEntity.ok().body(Map.of("exist", false));
        }
    }

    @GetMapping("/chat/list")
    public List<ChatRoomResponseDTO> getChatListWithMessages(@RequestParam("userId") String userId) {
        return chatRoomService.getChatListWithMessages(userId);
    }

//    @GetMapping("/chat/list")
//    public List<ChatRoom> getChatList(@RequestHeader("Authorization") String authToken) {
//        // 클라이언트로부터 전달된 Authorization 헤더에서 토큰 추출
//        String userId = extractUserIdFromToken(authToken);
//        // 유저 아이디를 기반으로 채팅 목록 조회
//        return chatRoomService.getChatList(userId);
//    }

}