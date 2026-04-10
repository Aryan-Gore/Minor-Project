package com.indiapost.financialneeds.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.util.Date;
import javax.crypto.SecretKey;

// @Component tells Spring to manage this class — you can @Autowired it anywhere
@Component
public class JwtUtil {

    // @Value reads from application.properties
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;  // 86400000ms = 24 hours

    // Convert the secret string to a cryptographic key
    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // Called after login — creates a signed token containing userId and role
    public String generateToken(String userId, String role) {
        return Jwts.builder()
                .subject(userId)                          // who this token belongs to
                .claim("role", role)                     // USER or ADMIN
                .issuedAt(new Date())                     // created now
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getKey())                       // sign with secret
                .compact();                               // build the token string
    }

    // Called on every request — reads userId from token
    public String extractUserId(String token) {
        return Jwts.parser().verifyWith(getKey()).build()
                .parseSignedClaims(token).getPayload().getSubject();
    }

    // Called on every request — reads role from token
    public String extractRole(String token) {
        return Jwts.parser().verifyWith(getKey()).build()
                .parseSignedClaims(token).getPayload().get("role", String.class);
    }

    // Check token is valid and not expired
    public boolean isTokenValid(String token) {
        try {
            Jwts.parser().verifyWith(getKey()).build().parseSignedClaims(token);
            return true;
        } catch (JwtException e) {
            return false;  // expired, tampered, or invalid
        }
    }
}
