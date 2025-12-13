package com.techhive.auth_service.dto;
import lombok.Data;
@Data
public class ChangePasswordRequestDTO {
    private String currentPassword;
    private String newPassword;
}