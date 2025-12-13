package com.techhive.auth_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity // This annotation activates Spring Security's web security support
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Disable CSRF (Cross-Site Request Forgery) protection.
                // This is common for stateless REST APIs that use tokens for authentication.
                .csrf(csrf -> csrf.disable())

                // 2. Configure authorization rules.
                .authorizeHttpRequests(auth -> auth
                        // Allow unauthenticated access to our public auth endpoints.
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        // Require authentication for any other request in the application.
                        .anyRequest().authenticated()
                )

                // 3. Configure session management to be stateless.
                // The server will not create or maintain any user session.
                // Every request must be authenticated with the token.
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                );

        return http.build();
    }
}