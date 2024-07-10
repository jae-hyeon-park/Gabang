package com.aboba.gabang.trade.dto;

import com.aboba.gabang.product.model.Image;
import com.aboba.gabang.product.model.Product;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
public class TradeResponseDto {

    private Integer productId;

    private String productName;

    private Integer productPrice;

    private Integer tradeId;

    private String tradeWay;

    private String tradeState;

    private List<String> imageURLs = new ArrayList<>();

    private String invoicenumber;

    private String deliverycompany;

    private LocalDateTime transactionCompletionTime;

    public TradeResponseDto(Product product, LocalDateTime transactionCompletionTime) {
        this.productId = product.getProductId();
        this.productName = product.getProductName();
        this.productPrice = product.getProductPrice();
        this.tradeWay = product.getTradeWay();
        this.tradeState = product.getTradeState();
        this.transactionCompletionTime = transactionCompletionTime;

        if (product.getTrade() != null) {
            this.tradeId = product.getTrade().getTradeId();
            this.invoicenumber = product.getTrade().getInvoicenumber();
            this.deliverycompany = product.getTrade().getDeliverycompany();
        } else {
            this.tradeId = null;
            this.invoicenumber = null;
            this.deliverycompany = null;
        }

        for (Image i :product.getImages()) {
            imageURLs.add(i.getImgUrl());
        }
    }

}
