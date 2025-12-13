package com.techhive.auth_service.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtService {

    // These values are injected from our application.properties file
    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration.ms}")
    private long expirationTime;

    /**
     * Generates a new JWT for a successfully authenticated user.
     * @param employeeId The employee's unique ID (e.g., "TH-0001")
     * @param email The employee's email address.
     * @param role The employee's role (e.g., "ADMIN" or "EMPLOYEE")
     * @return A signed JWT string.
     */
    public String generateToken(String employeeId, String email, String role, String fullName) {
        Algorithm algorithm = Algorithm.HMAC256(secretKey);

        return JWT.create()
                .withIssuer("auth-service")
                .withSubject(employeeId)
                .withClaim("email", email)
                .withClaim("role", role)
                .withClaim("name", fullName) // <<<--- ADD THIS NEW CLAIM
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + expirationTime))
                .sign(algorithm);
    }
}