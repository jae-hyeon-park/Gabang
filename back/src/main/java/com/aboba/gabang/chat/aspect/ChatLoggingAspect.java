package com.aboba.gabang.chat.aspect;

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
public class ChatLoggingAspect {
    private static final Logger logger = LoggerFactory.getLogger(ChatLoggingAspect.class);
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    // 유저 아이디 가져오기
    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal() instanceof String) {
            return "anonymous";
        }
        return ((UserDetails) authentication.getPrincipal()).getUsername();
    }

    // 현재 시간으로 변경
    private String getCurrentFormattedTime() {
        LocalDateTime now = LocalDateTime.ofInstant(Instant.ofEpochMilli(System.currentTimeMillis()), ZoneId.systemDefault());
        return now.format(formatter);
    }

    // 채팅 메시지 저장 로그
    @AfterReturning("execution(* com.aboba.gabang.chat.service.ChatService.saveChatMessage(..))")
    public void logAfterSavingChatMessage(JoinPoint joinPoint) {
        String userId = getCurrentUserId();
        String formattedTime = getCurrentFormattedTime();
        logger.info("채팅 메시지 저장 by User ID: {}, 시간: {}", userId, formattedTime);
    }

    // 채팅방 생성 또는 찾기 로그
    @AfterReturning("execution(* com.aboba.gabang.chat.service.ChatService.findOrCreateChatRoom(..))")
    public void logAfterFindingOrCreateChatRoom(JoinPoint joinPoint) {
        String userId = getCurrentUserId();
        String formattedTime = getCurrentFormattedTime();
        logger.info("채팅방 생성/찾기 by User ID: {}, 시간: {}", userId, formattedTime);
    }
}