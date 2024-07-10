package com.aboba.gabang.trade.dto;

import lombok.Getter;

@Getter
public class TradeRequestDeleteDto {

    private String sellerId;
    private String buyerId;
    private Integer productId;

}
