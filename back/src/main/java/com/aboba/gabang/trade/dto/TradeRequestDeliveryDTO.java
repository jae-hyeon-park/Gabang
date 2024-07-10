package com.aboba.gabang.trade.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TradeRequestDeliveryDTO {
    private Integer productId;
    private String invoicenumber;
    private String deliverycompany;
}