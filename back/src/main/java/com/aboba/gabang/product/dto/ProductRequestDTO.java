package com.aboba.gabang.product.dto;

import com.aboba.gabang.product.model.Category;
import com.aboba.gabang.product.model.Product;
import com.aboba.gabang.user.model.User;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductRequestDTO {

    private String productName;

    private Integer categoryId;

    private Integer productPrice;

    private String tradeWay;

    private String tradeLocation;

    private boolean ynDeliveryfee;

    private String productExplain;

    private String userId;

    public Product toEntity(User user, Category category) {
        return Product.builder()
                .seller(user)
                .productName(productName)
                .category(category)
                .productPrice(productPrice)
                .productExplain(productExplain)
                .tradeWay(tradeWay)
                .tradeLocation(tradeLocation)
                .ynDeliveryfee(ynDeliveryfee)
                .registrationDate(LocalDateTime.now())
                .build();
    }


}
