package com.aboba.gabang.product.repository;

import com.aboba.gabang.product.dto.ProductResponseAccountDTO;
import com.aboba.gabang.product.dto.ProductResponseDTO;
import com.aboba.gabang.product.dto.ProductResponseMainDTO;
import com.aboba.gabang.product.model.Product;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.repository.query.Param;

import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Product p WHERE p.productId = :productId")
    Optional<Product> findProductForUpdate(@Param("productId") Integer productId);

    @Query("SELECT p FROM Product p WHERE p.category.categoryId = :categoryId")
    List<ProductResponseMainDTO> findByCategoryId(@Param("categoryId") Integer categoryId);

    @Query("SELECT new com.aboba.gabang.product.dto.ProductResponseDTO(p) FROM Product p WHERE p.ynDelete = false")
    Page<ProductResponseDTO> findAllByPage(Pageable pageable);

    @Query("SELECT new com.aboba.gabang.product.dto.ProductResponseDTO(p) FROM Product p WHERE p.productName LIKE CONCAT('%', :searchKeyword, '%') AND p.ynDelete = false")
    Page<ProductResponseDTO> findAllByProductNameContaining(String searchKeyword, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.seller.id = :userId AND p.ynDelete = false")
    Page<ProductResponseDTO> findAllBySellerId(@Param("userId") String userId, Pageable pageable);

    @Query("SELECT new com.aboba.gabang.product.dto.ProductResponseDTO(p) FROM Product p WHERE p.seller.userId = :userId AND p.tradeState = :tradeState AND p.ynDelete = false")
    Page<ProductResponseDTO> findBySellerUserIdAndTradeState(@Param("userId") String userId, @Param("tradeState") String tradeState, Pageable pageable);

    @Query("SELECT new com.aboba.gabang.product.dto.ProductResponseDTO(p) FROM Product p WHERE p.seller.id = :userId AND p.productName LIKE CONCAT('%', :searchKeyword, '%') AND p.ynDelete = false")
    Page<ProductResponseDTO> findByProductNameContaining(String userId, String searchKeyword, Pageable pageable);

    @Query("SELECT new com.aboba.gabang.product.dto.ProductResponseAccountDTO(p.seller.id, p.productPrice) FROM Product p WHERE p.productId = :productId")
    Optional<ProductResponseAccountDTO> findByProductId2(@Param("productId") Integer productId);

    // 탈퇴하지 않은 사용자의 상품 전체 조회
    @Query("SELECT p FROM Product p WHERE p.seller.ynSecession = false AND p.ynDelete = false AND p.productId <> 37")
    List<Product> findAllActive();

    // 탈퇴하지 않은 사용자의 카테고리별 상품 조회
    @Query("SELECT p FROM Product p WHERE p.seller.ynSecession = false AND p.category.categoryId = :categoryId AND p.ynDelete = false AND p.productId <> 37")
    List<Product> findByCategoryIdAndActive(@Param("categoryId") Integer categoryId);

}
