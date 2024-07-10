package com.aboba.gabang.product.dto;

import com.aboba.gabang.product.model.Category;
import com.aboba.gabang.product.model.Image;
import com.aboba.gabang.product.model.Product;
import com.aboba.gabang.user.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class ProductResponseDetailDTO {

    private String productName;

    private Integer productPrice;

    private String productExplain;

    private String tradeState;

    private boolean ynDeliveryfee;

    private LocalDateTime registrationDate;

    private User seller;

    private String tradeWay;

    private String tradeLocation;

    private Category category;

    private List<String> imageURLs;

    public ProductResponseDetailDTO(Product product) {
        this.productExplain = product.getProductExplain();
        this.productName = product.getProductName();
        this.productPrice = product.getProductPrice();
        this.tradeState = product.getTradeState();
        this.ynDeliveryfee = product.isYnDeliveryfee();
        this.registrationDate = product.getRegistrationDate();
        this.seller = product.getSeller();
        this.tradeWay = product.getTradeWay();
        this.tradeLocation = product.getTradeLocation();
        this.category = product.getCategory();
        this.imageURLs = new ArrayList<>();

        for (Image i :product.getImages()){
            imageURLs.add(i.getImgUrl());
        }
    }

}
