package com.aboba.gabang.product.controller;

import com.aboba.gabang.product.aspect.ProductLoggingAspect;
import com.aboba.gabang.product.dto.*;
import com.aboba.gabang.product.model.Product;
import com.aboba.gabang.product.service.AddProductService;
//import com.aboba.gabang.product.service.GetProductService;
import com.aboba.gabang.product.service.ProductService;
import com.aboba.gabang.product.service.S3Service;
import com.aboba.gabang.product.service.UpdateProductService;
//import com.drew.imaging.jpeg.JpegProcesnsingExceptio;

import lombok.RequiredArgsConstructor;

import net.coobird.thumbnailator.Thumbnails;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    private final ProductService productService;
    private final AddProductService addProductService;
    private final UpdateProductService updateProductService;
    private final S3Service s3Service;

    // 상품 전체 조회 및 카테고리별 조회
    @GetMapping
    public ResponseEntity<List<ProductResponseMainDTO>> getProducts(@RequestParam(defaultValue = "", name = "category") Integer category) {
        List<ProductResponseMainDTO> products;
        if (category != null) {
            products = productService.findByCategoryId(category);
        } else {
            products = productService.findAllMain();
        }
        return ResponseEntity.ok(products);
    }

    // 상품 상세 조회
    @GetMapping("/{productId}")
    public ResponseEntity<?> getProductById(@PathVariable("productId") Integer productId) {
        Optional<Product> productOpt = productService.findById(productId);

        if (productOpt.isPresent()) {
            ProductResponseDetailDTO productDetailDTO = new ProductResponseDetailDTO(productOpt.get());
            return new ResponseEntity<>(productDetailDTO, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("ID가 " + productId + "인 제품을 찾을 수 없습니다", HttpStatus.NOT_FOUND);
        }

    }

    // 판매 상품 조회
    @GetMapping("/my/{userId}")
    public ResponseEntity<Page<ProductResponseDTO>> getMyProducts(
            @PathVariable String userId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String state,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Page<ProductResponseDTO> products = productService.findBySellerId(userId, search, state, page, size);
        return ResponseEntity.ok()
                .body(products);
    }

    @GetMapping("/page")
    public ResponseEntity<Page<ProductResponseDTO>> getProductsPage(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Page<ProductResponseDTO> products = productService.findAll(search, page, size);
        return ResponseEntity.ok()
                .body(products);
    }

    @PostMapping
    public ResponseEntity<?> enrollProduct(
            @RequestPart("data") ProductRequestDTO productDTO,
            @RequestPart("images")MultipartFile[] images){

        List<String> imageUrls = Arrays.stream(images)
                .map(image -> {
                    try {
                        return s3Service.uploadFile(image);
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                })
                .collect(Collectors.toList());

        Product p = addProductService.createProduct(productDTO);

        if(p != null) {
            addProductService.addImage(imageUrls, p);
        }

        return ResponseEntity.ok("상품이 등록되었습니다.");
    }

    @PutMapping
    public ResponseEntity<?> editProduct(
            @RequestPart("data") ProductRequestUpdateDTO productDTO,
            @RequestPart(value = "images", required = false)MultipartFile[] images){

        List<String> imageUrls = new ArrayList<>();
        if(images != null) {
            imageUrls = Arrays.stream(images)
                    .map(image -> {
                        try {
                            return s3Service.uploadFile(image);
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }catch (Exception e) {
                            throw new RuntimeException(e);
                        }
                    })
                    .collect(Collectors.toList());
        }

        Product p = updateProductService.updateProduct(productDTO);

        if(p != null && imageUrls !=null) {
            addProductService.addImage(imageUrls, p);
        }

        return ResponseEntity.ok("상품이 등록되었습니다.");
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<String> deleteProduct(@PathVariable Integer productId) {
        try {
            productService.deleteProduct(productId);
            return ResponseEntity.status(HttpStatus.OK)
                    .body("삭제되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("다시 시도해주세요.");
        }
    }
}
