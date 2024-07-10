package com.aboba.gabang.trade.dto;

import com.aboba.gabang.product.model.Category;
import com.aboba.gabang.product.model.Product;
import com.aboba.gabang.trade.model.Trade;
import com.aboba.gabang.user.model.User;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TradeDTO {
    private String destination;

    private String buyerId; // user객체 관련

    private String cdPaymentMethod;

    private int payment;

    private String transactionMethod;

    private int productId; // product 객체 관련


    public Trade toEntity(User user, Product product) {
        return Trade.builder()
                .buyer(user)
                .destination(destination)
                .tradeCompletionTime(LocalDateTime.now())
                .cdPaymentMethod(cdPaymentMethod)
                .payment(payment)
                .transactionMethod(transactionMethod)
                .product(product)
                .build();
    }


}
