package com.ssafy12.moinsoop.skinfit.global.security;

import com.ssafy12.moinsoop.skinfit.domain.user.entity.enums.RoleType;
import com.ssafy12.moinsoop.skinfit.global.config.RefreshTokenService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String token = resolveToken(request);

        try {
            if (token != null && jwtTokenProvider.validateToken(token)) {
                // 유효한 토큰인 경우 정상 처리
                Claims claims = jwtTokenProvider.getClaims(token);
                setAuthentication(claims);  // 이 부분 추가
            }
        } catch (ExpiredJwtException e) {
            try {
                // 만료된 액세스 토큰에서 정보 추출
                Claims expiredClaims = e.getClaims();
                Integer userId = expiredClaims.get("userId", Integer.class);
                RoleType roleType = RoleType.valueOf(expiredClaims.get("roleType", String.class));

                // Redis에서 리프레시 토큰 조회
                String refreshToken = refreshTokenService.getRefreshToken(userId);
                if (refreshToken != null && jwtTokenProvider.validateToken(refreshToken)) {
                    // 새 액세스 토큰 생성
                    String newAccessToken = jwtTokenProvider.generateAccessToken(userId, roleType);

                    // 응답 헤더에 새 액세스 토큰 설정
                    response.setHeader("Authorization", "Bearer " + newAccessToken);

                    // 새 토큰의 클레임으로 인증 정보 설정
                    Claims newClaims = jwtTokenProvider.getClaims(newAccessToken);
                    setAuthentication(newClaims);  // 이 부분 추가
                } else {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    return;
                }
            } catch (Exception refreshException) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    private void setAuthentication(Claims claims) {
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        claims.get("userId"),
                        null,
                        List.of(new SimpleGrantedAuthority("ROLE_" + claims.get("roleType")))
                );
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
