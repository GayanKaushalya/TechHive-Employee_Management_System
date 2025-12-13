package com.techhive.api_gateway.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    // Inject the secret key from application.yml
    @Value("${jwt.secret}")
    private String secretKey;

    /**
     * Validates a given JWT token.
     * @param token The JWT string.
     * @return true if the token is valid, false otherwise.
     */
    public boolean validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secretKey);
            JWTVerifier verifier = JWT.require(algorithm)
                    .withIssuer("auth-service") // We must check that our auth-service issued it
                    .build();
            DecodedJWT decodedJWT = verifier.verify(token);
            return true; // If no exception is thrown, the token is valid
        } catch (Exception e) {
            // Token is invalid (e.g., signature doesn't match, it's expired, etc.)
            return false;
        }
    }

    public String getSubject(String token) {
        Algorithm algorithm = Algorithm.HMAC256(secretKey);
        JWTVerifier verifier = JWT.require(algorithm).build();
        DecodedJWT decodedJWT = verifier.verify(token);
        return decodedJWT.getSubject();
    }
}