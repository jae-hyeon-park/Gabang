package com.aboba.gabang.product.dto;

import com.aboba.gabang.product.model.Image;
import com.aboba.gabang.product.model.Product;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
public class ProductResponseDTO {

    private Integer productId;

    private Integer productPrice;

    private String productName;

    private String productExplain;

    private String tradeWay;

    private String tradeLocation;

    private boolean ynDeliveryfee;

    private String tradeState;

    private LocalDateTime registrationDate;

    private List<String> imageURLs = new ArrayList<>();

    private Integer tradeId;

    private Integer categoryId;

    public ProductResponseDTO(Product product) {
        this.productId = product.getProductId();
        this.productName = product.getProductName();
        this.productPrice = product.getProductPrice();
        this.tradeState = product.getTradeState();
        this.registrationDate = product.getRegistrationDate();
        if(product.getTrade() == null){
            this.tradeId = null;
        }
        else {
            this.tradeId = product.getTrade().getTradeId();
        }
        this.categoryId = product.getCategory().getCategoryId();
        this.productExplain = product.getProductExplain();
        this.tradeWay = product.getTradeWay();
        this.tradeLocation = product.getTradeLocation();
        this.ynDeliveryfee = product.isYnDeliveryfee();

        for (Image i :product.getImages()) {
            imageURLs.add(i.getImgUrl());
        }
    }
}