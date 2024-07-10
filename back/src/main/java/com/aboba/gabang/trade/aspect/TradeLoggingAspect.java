package com.aboba.gabang.trade.aspect;
import com.aboba.gabang.product.aspect.ProductLoggingAspect;
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
public class TradeLoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(TradeLoggingAspect.class);

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

    // 상품 결제
    @AfterReturning("execution(* com.aboba.gabang.trade.service.TradeService.createTrade(..))")
    public void logAfterTrade(JoinPoint joinPoint) {
        String userId = getCurrentUserId();
        String formattedTime = getCurrentFormattedTime();
        logger.info("상품 결제 by User ID: {}, 시간: {}", userId, formattedTime);
    }

    // 구매 확정
    @AfterReturning("execution(* com.aboba.gabang.trade.service.TradeService.updateTrade(..))")
    public void logAfterUpdateTrade(JoinPoint joinPoint) {
        String userId = getCurrentUserId();
        String formattedTime = getCurrentFormattedTime();
        logger.info("구매 확정 by User ID: {}, 시간: {}", userId, formattedTime);
    }

}
