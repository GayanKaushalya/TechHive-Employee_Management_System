package com.techhive.auth_service.dto;

import lombok.Data;

@Data
public class ActivationRequestDTO {
    private String email;
    private String temporaryPassword;
    private String newPassword;
}