package com.aboba.gabang.product.model;

import com.aboba.gabang.trade.model.Trade;
import com.aboba.gabang.user.model.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "product")
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Integer productId;

    @Column(name = "product_explain", length = 2000, nullable = false)
    private String productExplain;

    @Column(name = "product_price", nullable = false)
    private Integer productPrice;

    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "category_id", nullable = false)
    private Category category;

    @ManyToOne
    @JoinColumn(name = "seller_id", referencedColumnName = "user_id", nullable = false)
    private User seller;

    @Column(name = "product_name", length = 50, nullable = false)
    private String productName;

    @Column(name = "trade_way", length = 1, nullable = false)
    private String tradeWay;

    @Column(name = "trade_location", length = 100, nullable = false)
    private String tradeLocation;

    @Column(name = "yn_deliveryfee", nullable = false)
    private boolean ynDeliveryfee;

    @Builder.Default
    @Column(name = "yn_delete")
    private Boolean ynDelete = false; //삭제유무 처음엔 false

    @Builder.Default
    @Column(name = "trade_state", length = 1, nullable = false)
    private String tradeState = "1"; //처음엔 판매중

    @Column(name = "registrationdate", nullable = false)
    private LocalDateTime registrationDate;

    @Column(name = "updatedate")
    private LocalDateTime updateDate;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Image> images;

    @OneToOne(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Trade trade;

    public void delete() {
        this.ynDelete = true;
    }
}
