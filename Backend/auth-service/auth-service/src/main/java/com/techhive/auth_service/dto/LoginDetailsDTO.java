package com.techhive.auth_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// This DTO directly represents the columns returned by get_login_details_by_email_sp
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginDetailsDTO {
    private String employeeId;
    private String email;
    private String passwordHash;
    private String role;
    private String accountStatus;
    private String fullName;
}