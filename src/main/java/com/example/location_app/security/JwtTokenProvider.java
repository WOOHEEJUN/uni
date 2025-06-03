package com.example.location_app.security;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.example.location_app.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class JwtTokenProvider {

    @Value("${app.jwt.secret}") // ✅ properties에 맞춰 수정
    private String jwtSecret;

    @Value("${app.jwt.expiration}") // ✅ properties에 맞춰 수정
    private int jwtExpirationInMs;

    private Key key;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String createToken(User user) {
        Claims claims = Jwts.claims().setSubject(user.getUsername());
        claims.put("id", user.getId());
        claims.put("username", user.getUsername());
        claims.put("nickname", user.getNickname());
        claims.put("role", user.getRole().name());
        claims.put("status", user.getStatus().name());
        claims.put("universityId", user.getUniversity().getId());
        claims.put("universityName", user.getUniversity().getName()); // ✅ 대학명 포함

        Date now = new Date();
        Date validity = new Date(now.getTime() + jwtExpirationInMs);

        return Jwts.builder()
            .setClaims(claims)
            .setIssuedAt(now)
            .setExpiration(validity)
            .signWith(key)
            .compact();
    }

    public String getUsernameFromJWT(String token) {
        return getAllClaimsFromToken(token).getSubject();
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(authToken);
            return true;
        } catch (SecurityException ex) {
            log.error("Invalid JWT signature: {}", ex.getMessage());
        } catch (MalformedJwtException ex) {
            log.error("Invalid JWT token: {}", ex.getMessage());
        } catch (ExpiredJwtException ex) {
            log.error("Expired JWT token: {}", ex.getMessage());
        } catch (UnsupportedJwtException ex) {
            log.error("Unsupported JWT token: {}", ex.getMessage());
        } catch (IllegalArgumentException ex) {
            log.error("JWT claims string is empty: {}", ex.getMessage());
        }
        return false;
    }

    public Claims getAllClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public Claims getClaims(String token) {
        return getAllClaimsFromToken(token);
    }

    public Long getUserIdFromJWT(String token) {
        return Long.parseLong(String.valueOf(getAllClaimsFromToken(token).get("id")));
    }

    public String getNicknameFromJWT(String token) {
        return String.valueOf(getAllClaimsFromToken(token).get("nickname"));
    }

    public String getUniversityNameFromJWT(String token) {
        return String.valueOf(getAllClaimsFromToken(token).get("universityName"));
    }
}