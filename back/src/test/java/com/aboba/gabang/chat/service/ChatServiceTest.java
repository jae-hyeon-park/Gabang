package com.aboba.gabang.chat.service;

import com.aboba.gabang.chat.dto.ChatMessageDTO;
import com.aboba.gabang.chat.model.ChatMessage;
import com.aboba.gabang.chat.model.ChatRoom;
import com.aboba.gabang.chat.repository.ChatRoomRepository;
import com.aboba.gabang.product.model.Category;
import com.aboba.gabang.product.model.Image;
import com.aboba.gabang.product.model.Product;
import com.aboba.gabang.user.model.User;
import jakarta.persistence.*;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@SpringBootTest
class ChatServiceTest {

    @Mock
    private ChatRoomRepository chatRoomRepository;
    @InjectMocks
    private ChatRoomService chatRoomService;

    @Test
    public void testFindOrCreateChatRoom() {

        // Given
        Category category = new Category(1, "욕실용품");
        User user1 = User.builder()
                .userId("user01")
                .userPwd("1234")
                .userName("sil")
                .userPhoneNumber("01012345678")
                .userBirthdate("19931221")
                .cdBankcode("01")
                .userAccount("123-456-789012")
                .joinDate(LocalDateTime.now())
                .updateDate(LocalDateTime.now())
                .ynInsurance(false)
                .ynSecession(false)
                .role("user")
                .suspensions(new ArrayList<>())
                .build();

        User user2 = User.builder()
                .userId("user02")
                .userPwd("1234")
                .userName("lim")
                .userPhoneNumber("01012345678")
                .userBirthdate("19931221")
                .cdBankcode("02")
                .userAccount("123-456-789012")
                .joinDate(LocalDateTime.now())
                .updateDate(LocalDateTime.now())
                .ynInsurance(false)
                .ynSecession(false)
                .role("user")
                .suspensions(new ArrayList<>())
                .build();

        Image image = new Image(1, "https://www.google.com/url?sa=i&url=https%3A%2F%2Fprod.danawa.com%2Finfo%2F%3Fpcode%3D7649362&psig=AOvVaw3-UeRtkoAmbo-yLNdOknmb&ust=1714010450286000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCLj4ndLg2YUDFQAAAAAdAAAAABAE", null);

        Product product = new Product(1, "발을 씻을 수 있는 제품입니다", 10000, category, user1, "발을 씻자", "1", "상암IT타워", false, false, "1", LocalDateTime.now(), LocalDateTime.now(), List.of(image), null);

        ChatRoom existingChatRoom = new ChatRoom(1, product, user1, user2, new ArrayList<>());

        ChatMessage chatMessage1 = ChatMessage.builder()
                .chatId(1)
                .contents("안녕하세요 구매 원합니다")
                .sender(user2)
                .inputDate(LocalDateTime.now())
                .chatRoom(existingChatRoom)
                .build();

        ChatMessage chatMessage2 = ChatMessage.builder()
                .chatId(2)
                .contents("네 가능합니다")
                .sender(user1)
                .inputDate(LocalDateTime.now())
                .chatRoom(existingChatRoom)
                .build();

        when(chatRoomRepository.findExistingChatRoom(1, "user01", "user02")).thenReturn(existingChatRoom);

        // When
        ChatRoom result = chatRoomService.findExistingChatRoom(1, "user01", "user02");

        // Then
        assertNotNull(result);
        assertEquals(existingChatRoom, result);
        assertEquals(user1, result.getUser1());
        assertEquals(user2, result.getUser2());
        assertEquals(product, result.getProduct());
    }
}