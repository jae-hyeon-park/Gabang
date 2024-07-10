package com.aboba.gabang.product.dto;

import lombok.Getter;

@Getter
public class ProductResponseAccountDTO {
    private String sellerId;
    private Integer productPrice;

    public ProductResponseAccountDTO(String sellerId, Integer productPrice) {
        this.sellerId = sellerId;
        this.productPrice = productPrice;
    }
}
