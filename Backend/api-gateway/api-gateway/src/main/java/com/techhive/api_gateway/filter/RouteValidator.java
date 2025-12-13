package com.techhive.api_gateway.filter;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {

    // Define a list of public endpoints that do not require authentication
    public static final List<String> publicApiEndpoints = List.of(
            "/api/v1/auth/activate",
            "/api/v1/auth/login"
    );

    // A predicate that returns true if the request path is NOT in the public list
    public Predicate<ServerHttpRequest> isSecured =
            request -> publicApiEndpoints
                    .stream()
                    .noneMatch(uri -> request.getURI().getPath().contains(uri));
}