package com.aboba.gabang.chat.model;

import com.aboba.gabang.product.model.Product;
import com.aboba.gabang.user.model.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "chat_room")
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private Integer roomId;

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "product_id", nullable = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "user1_id", referencedColumnName = "user_id", nullable = false)
    private User user1;

    @ManyToOne
    @JoinColumn(name = "user2_id", referencedColumnName = "user_id", nullable = false)
    private User user2;

    @OneToMany(mappedBy = "chatRoom")
    private List<ChatMessage> messages;

}
