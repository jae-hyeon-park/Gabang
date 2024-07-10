package com.aboba.gabang.trade.model;

import com.aboba.gabang.user.model.User;
import com.aboba.gabang.product.model.Product;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "trade")
public class Trade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trade_id")
    private Integer tradeId;

    @Column(name = "destination", length = 100)
    private String destination; //배송지

    @ManyToOne
    @JoinColumn(name = "buyer_id", referencedColumnName = "user_id", nullable = false)
    private User buyer; //구매자

    @Column(name = "transaction_completion_time")
    private LocalDateTime transactionCompletionTime; //구매확정 시간

    @Column(name = "trade_completion_time", nullable = false)
    private LocalDateTime tradeCompletionTime; //결제완료 시간

    @Column(name = "cd_paymentmethod", length = 2, nullable = false)
    private String cdPaymentMethod; // 결제 수단

    @Column(name = "payment", nullable = false)
    private Integer payment; //결제 금액

    @Column(name = "transaction_method", length = 1, nullable = false)
    private String transactionMethod; //거래방식

//    @ManyToOne
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", referencedColumnName = "product_id", nullable = false)
    private Product product;

    @Column(name = "invoicenumber", length = 20)
    private String invoicenumber;

    @Column(name = "deliverycompany", length = 1)
    private String deliverycompany;

    public void update(LocalDateTime transactionCompletionTime) {
        this.transactionCompletionTime = transactionCompletionTime;
    }
}
