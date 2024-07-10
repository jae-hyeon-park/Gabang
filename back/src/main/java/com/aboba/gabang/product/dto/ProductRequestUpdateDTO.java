package com.aboba.gabang.product.dto;

import com.aboba.gabang.product.model.Category;
import com.aboba.gabang.product.model.Product;
import com.aboba.gabang.user.model.User;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductRequestUpdateDTO {

    private Integer productId;

    private String productName;

    private List<String> deleteImageURLs;

    private Integer categoryId;

    private Integer productPrice;

    private String tradeWay;

    private String tradeLocation;

    private boolean ynDeliveryfee;

    private String productExplain;

    private String userId;

    public Product setEntity(Product p, ProductRequestUpdateDTO dto, Category category){
        p.setProductName(dto.getProductName());
        p.setCategory(category);
        p.setProductPrice(dto.getProductPrice());
        p.setTradeWay(dto.getTradeWay());
        p.setTradeLocation(dto.tradeLocation);
        p.setYnDeliveryfee(dto.ynDeliveryfee);
        p.setProductExplain(dto.getProductExplain());

        return p;
    }



}
