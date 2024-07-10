package com.aboba.gabang.product.dto;

import com.aboba.gabang.product.model.Category;
import com.aboba.gabang.product.model.Product;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductResponseMainDTO {
    private Integer productId;

    private String productName;

    private Integer productPrice;

    private String tradeState;

    private LocalDateTime registrationDate;

    private String imageUrl;

    private Category category;


    public ProductResponseMainDTO(Product product) {
        this.productId = product.getProductId();
        this.productName = product.getProductName();
        this.productPrice = product.getProductPrice();
        this.tradeState = product.getTradeState();
        this.registrationDate = product.getRegistrationDate();
        this.imageUrl = product.getImages().get(0).getImgUrl();
        this.category = product.getCategory();
    }

}
