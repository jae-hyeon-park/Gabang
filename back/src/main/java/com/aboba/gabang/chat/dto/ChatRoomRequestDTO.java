package com.aboba.gabang.chat.dto;

import com.aboba.gabang.product.model.Product;
import lombok.Data;

@Data
public class ChatRoomRequestDTO {
    private Integer productId;
    private String user1;
    private String user2;

}
