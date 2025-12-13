package com.techhive.auth_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor // A handy lombok annotation to create a constructor
public class LoginResponseDTO {
    private String token;
}