package com.aboba.gabang.chat.repository;

import com.aboba.gabang.chat.model.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface ChatRoomRepository extends JpaRepository<ChatRoom, Integer> {

      @Query("SELECT c FROM ChatRoom c WHERE " +
              "(c.product.productId = :productId AND c.user1.userId = :user1 AND c.user2.userId = :user2) " +
              "OR " +
              "(c.product.productId = :productId AND c.user1.userId = :user2 AND c.user2.userId = :user1)")
      ChatRoom findExistingChatRoom(@Param("productId") Integer productId,
                                    @Param("user1") String user1,
                                    @Param("user2") String user2);

    @Query("SELECT c FROM ChatRoom c WHERE c.user1.userId = :userId OR c.user2.userId = :userId")
    List<ChatRoom> findAllByUser1IdOrUser2Id(@Param("userId") String userId1,
                                             @Param("userId") String userId2);

}
