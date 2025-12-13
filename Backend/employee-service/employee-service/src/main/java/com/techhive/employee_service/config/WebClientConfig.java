package com.techhive.employee_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient projectServiceWebClient() {
        return WebClient.builder()
                .baseUrl("http://localhost:8082/api/v1") // The base URL of the project-service
                .build();
    }
}