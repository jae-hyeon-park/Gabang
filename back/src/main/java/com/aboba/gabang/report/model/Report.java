package com.aboba.gabang.report.model;

import com.aboba.gabang.product.model.Product;
import com.aboba.gabang.user.model.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "report")
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Long reportId;

    @Column(name = "report_title", length = 20, nullable = false)
    private String reportTitle;

    @Column(name = "report_detail", length = 500, nullable = false)
    private String reportDetail;


    @Column(name = "report_type", length = 30, nullable = false)
    private String reportType;

    @Column(name = "registrationdate", nullable = false)
    private LocalDateTime registrationDate;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "product_id", nullable = false)
    private Product product;
}
