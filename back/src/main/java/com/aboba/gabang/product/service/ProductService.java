package com.aboba.gabang.product.service;

import com.aboba.gabang.product.controller.ProductController;
import com.aboba.gabang.product.dto.ProductResponseDTO;
import com.aboba.gabang.product.dto.ProductResponseMainDTO;
import com.aboba.gabang.product.model.Product;
import com.aboba.gabang.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<ProductResponseMainDTO> findAllMain() {
        List<Product> products = productRepository.findAllActive();
        return products.stream()
                .map(ProductResponseMainDTO::new)
                .collect(Collectors.toList());
    }

    public List<ProductResponseMainDTO> findByCategoryId(Integer categoryId) {
        List<Product> products = productRepository.findByCategoryIdAndActive(categoryId);
        return products.stream()
                .map(ProductResponseMainDTO::new)
                .collect(Collectors.toList());
    }

    public Optional<Product> findById(Integer productId) {
        return productRepository.findById(productId);
    }

    public Page<ProductResponseDTO> findAll(String search, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);

        // 검색어 있는 경우
        if (search != null && !search.equals("null") && !search.equals("undefined")) {
            return productRepository.findAllByProductNameContaining(search, pageRequest);
        }

        return productRepository.findAllByPage(pageRequest);
    }

    public Page<ProductResponseDTO> findBySellerId(String userId, String search, String state, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);

        if (search != null && !search.equals("null") && !search.equals("undefined")) { // 검색어가 있는 경우
            return productRepository.findByProductNameContaining(userId, search, pageRequest);
        }

        if (state != null && !state.equals("null") && !state.equals("undefined")) { // 검색어 없고 상태가 있는 경우
            return productRepository.findBySellerUserIdAndTradeState(userId, state, pageRequest);
        } else { // 사용자 아이디만 있는 경우
            return productRepository.findAllBySellerId(userId, pageRequest);
        }
    }

    public Page<ProductResponseDTO> findByProductNameContaining(String userId, String searchKeyword, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        return productRepository.findByProductNameContaining(userId, searchKeyword, pageRequest);
    }

    // 판매 상태 변경
    public void updateState(Integer productId, String state){
        Optional<Product> optP = productRepository.findById(productId);
        Product p =optP.get();

        p.setTradeState(state);
//        productRepository.save(p);
    }

    @Transactional
    public void deleteProduct(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("not found: " + productId));
        product.delete();
    }

}