package com.aboba.gabang.jwt;

import com.aboba.gabang.user.dto.CustomUserDetails;
import com.aboba.gabang.user.model.User;
import com.aboba.gabang.user.repository.SuspensionRepository;
import com.aboba.gabang.user.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collection;
import java.util.Iterator;

public class SigninFilter extends UsernamePasswordAuthenticationFilter {
    private static final Logger logger = LoggerFactory.getLogger(SigninFilter.class);
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;
    private final UserRepository userRepository;
    private final SuspensionRepository suspensionRepository;

    private String getCurrentFormattedTime() {
        return LocalDateTime.now().format(formatter);
    }

    public SigninFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil, UserRepository userRepository, SuspensionRepository suspensionRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.suspensionRepository = suspensionRepository;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {

        String username = obtainUsername(request);
        String password = obtainPassword(request);

        // 로그인 시도한 유저 정보 가져오기
        User user = userRepository.findByUserIdAndYnSecession(username, false);

        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        boolean isSuspension = suspensionRepository.existsSuspensionsByUserId(username);

        if(isSuspension) {
            throw new DisabledException("Disabled user");
        }

        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, password, null);
        logger.info("로그인 시도: 사용자명 - {}, 시간 - {}", username, getCurrentFormattedTime());
        return authenticationManager.authenticate(authToken);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) {

        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();

        String userId = customUserDetails.getUsername();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();

        String role = auth.getAuthority();

        String userName = customUserDetails.getName();

        String token = jwtUtil.createJwt(userId, role, userName, 60*60*1000L);

        response.addHeader("Authorization", "Bearer " + token);
        logger.info("로그인 성공: 사용자명 - {}, 시간 - {}", userId, getCurrentFormattedTime());
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException {
//        response.setStatus(401);
        String username = obtainUsername(request);
        if (failed instanceof UsernameNotFoundException) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            response.setContentType("text/plain; charset=UTF-8");
            response.getWriter().write("가입 정보를 찾을 수 없습니다.");
            response.getWriter().flush();
            logger.info("로그인 실패[가입 정보를 찾을 수 없습니다.]: 사용자명 - {}, 시간 - {}", username, getCurrentFormattedTime());
        } else if (failed instanceof DisabledException) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("text/plain; charset=UTF-8");
            response.getWriter().write("계정이 비활성화되었습니다. \n관리자에게 문의하세요.");
            response.getWriter().flush();
            logger.info("로그인 실패[계정이 비활성화되었습니다.]: 사용자명 - {}, 시간 - {}", username, getCurrentFormattedTime());
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("text/plain; charset=UTF-8");
            response.getWriter().write("비밀번호가 일치하지 않습니다.");
            response.getWriter().flush();
            logger.info("로그인 실패[비밀번호가 일치하지 않습니다.]: 사용자명 - {}, 시간 - {}", username, getCurrentFormattedTime());
        }
    }
}