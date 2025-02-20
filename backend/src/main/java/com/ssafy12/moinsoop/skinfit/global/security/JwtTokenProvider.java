package com.ssafy12.moinsoop.skinfit.global.security;

import com.ssafy12.moinsoop.skinfit.domain.user.entity.enums.RoleType;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    private final JwtProperties jwtProperties;

    public String generateAccessToken(Integer userId, RoleType roleType) {
        return generateToken(userId, roleType, jwtProperties.getAccessTokenExpiration());
    }

    public String generateRefreshToken(Integer userId, RoleType roleType) {
        return generateToken(userId, roleType, jwtProperties.getRefreshTokenExpiration());
    }

    private String generateToken(Integer userId, RoleType roleType, long expiration) {
        Claims claims = Jwts.claims();
        claims.put("userId", userId);
        claims.put("roleType", roleType);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            System.out.println("Validating token..."); // 로그 추가
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            System.out.println("Token is expired in validateToken"); // 로그 추가
            throw e;
        } catch (Exception e) {
            System.out.println("Token validation failed: " + e.getMessage()); // 로그 추가
            return false;
        }
    }

    public Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtProperties.getSecretKey());
        return Keys.hmacShaKeyFor(keyBytes);
    }


}
