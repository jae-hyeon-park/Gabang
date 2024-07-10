package com.aboba.gabang.trade.repository;

import com.aboba.gabang.product.model.Image;
import com.aboba.gabang.product.model.Product;
import com.aboba.gabang.trade.dto.TradeResponseDto;
import com.aboba.gabang.trade.model.Trade;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Transactional
public interface TradeRepository extends JpaRepository<Trade, Integer> {
    @Query("SELECT i FROM Trade i WHERE i.product.id = :productId")
    Trade findTradeByProductId(@Param("productId") Integer productId);

    @Query("SELECT new com.aboba.gabang.trade.dto.TradeResponseDto(t.product, t.transactionCompletionTime) " +
            "FROM Trade t " +
            "WHERE t.buyer.userId = :userId")
    Page<TradeResponseDto> findProductByBuyerId(@Param("userId") String userId, Pageable pageable);

    @Query("SELECT new com.aboba.gabang.trade.dto.TradeResponseDto(t.product, t.transactionCompletionTime) " +
            "FROM Trade t " +
            "WHERE t.buyer.userId = :userId " +
            "AND t.product.productName LIKE CONCAT('%', :searchKeyword, '%')")
    Page<TradeResponseDto> findProductByProductNameContaining(String userId, String searchKeyword, Pageable pageable);

    @Query("SELECT new com.aboba.gabang.trade.dto.TradeResponseDto(t.product, t.transactionCompletionTime) " +
            "FROM Trade t " +
            "WHERE t.buyer.userId = :userId " +
            "AND t.transactionCompletionTime IS NULL")
    Page<TradeResponseDto> findProductByBuyerIdWithNullTransactionCompletionTime(@Param("userId") String userId, Pageable pageable);

    @Query("SELECT new com.aboba.gabang.trade.dto.TradeResponseDto(t.product, t.transactionCompletionTime) " +
            "FROM Trade t " +
            "WHERE t.buyer.userId = :userId " +
            "AND t.transactionCompletionTime IS NOT NULL")
    Page<TradeResponseDto> findProductByBuyerIdWithNOTNullTransactionCompletionTime(@Param("userId") String userId, Pageable pageable);

    List<Trade> findByTradeCompletionTimeBetween(LocalDateTime sevenDaysAgoStart, LocalDateTime sevenDaysAgoEnd);

    Optional<Trade> findByProduct(@Param("product") Product product);

    @Modifying
    @Query("DELETE from Trade t where t.tradeId = :trade_id")
    void deleteByTradeId(@Param("trade_id") Integer trade_id);

}
