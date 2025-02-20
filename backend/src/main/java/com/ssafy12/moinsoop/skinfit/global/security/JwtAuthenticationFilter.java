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
                Claims claims = jwtTokenProvider.getClaims(token);
                setAuthentication(claims);
            }
        } catch (ExpiredJwtException e) {
            System.out.println("Token Expired Exception 발생!"); // 로그 추가
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"message\": \"Token is expired\"}");
            response.getWriter().flush();
            return;
        } catch (Exception e) {
            System.out.println("Other Exception: " + e.getMessage()); // 로그 추가
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
