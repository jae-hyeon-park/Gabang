package com.aboba.gabang.product.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.ZoneId;
import java.time.Instant;

@Aspect
@Component
public class ProductLoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(ProductLoggingAspect.class);
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    // 유저 아이디 가져오기
    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return ((UserDetails) authentication.getPrincipal()).getUsername();
    }

    // 현재 시간으로 변경
    private String getCurrentFormattedTime() {
        LocalDateTime now = LocalDateTime.ofInstant(Instant.ofEpochMilli(System.currentTimeMillis()), ZoneId.systemDefault());
        return now.format(formatter);
    }

    // 상품 등록
    @AfterReturning("execution(* com.aboba.gabang.product.service.AddProductService.createProduct(..))")
    public void logAfterProductAdd(JoinPoint joinPoint) {
        String userId = getCurrentUserId();
        String formattedTime = getCurrentFormattedTime();
        logger.info("상품 등록 by User ID: {}, 시간: {}", userId, formattedTime);
    }

    // 상품 수정
    @AfterReturning("execution(* com.aboba.gabang.product.service.UpdateProductService.updateProduct(..))")
    public void logAfterProductUpdate(JoinPoint joinPoint) {
        String userId = getCurrentUserId();
        String formattedTime = getCurrentFormattedTime();
        logger.info("상품 수정 by User ID: {}, 시간: {}", userId, formattedTime);
    }

    // 상품 삭제
    @AfterReturning("execution(* com.aboba.gabang.product.service.ProductService.deleteProduct(..))")
    public void logAfterProductDelete(JoinPoint joinPoint) {
        String userId = getCurrentUserId();
        String formattedTime = getCurrentFormattedTime();
        logger.info("상품 삭제 by User ID: {}, 시간: {}", userId, formattedTime);
    }

    // 마이 페이지 판매 내역 조회
    @AfterReturning("execution(* com.aboba.gabang.product.controller.ProductController.getMyProducts(..))")
    public void logAfterProductFindAtController(JoinPoint joinPoint) {
        String userId = getCurrentUserId();
        String formattedTime = getCurrentFormattedTime();
        logger.info("getMyProducts method of ProductController called by User ID: {}, 시간: {}", userId, formattedTime);
    }

    @AfterReturning("execution(* com.aboba.gabang.product.service.ProductService.findBySellerId(..))")
    public void logAfterProductFind(JoinPoint joinPoint) {
        String userId = getCurrentUserId();
        String formattedTime = getCurrentFormattedTime();
        logger.info("판매 내역 조회 by User ID: {}, 시간: {}", userId, formattedTime);
    }
}
