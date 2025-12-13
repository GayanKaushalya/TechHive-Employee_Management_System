package com.techhive.auth_service.controller;

import com.techhive.auth_service.dto.ActivationRequestDTO;
import com.techhive.auth_service.dto.ChangePasswordRequestDTO;
import com.techhive.auth_service.dto.LoginRequestDTO;
import com.techhive.auth_service.dto.LoginResponseDTO;
import com.techhive.auth_service.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // This endpoint for activation is correct
    @PostMapping("/activate")
    public ResponseEntity<String> activateAccount(@RequestBody ActivationRequestDTO activationRequest) {
        boolean isActivated = authService.activateAccount(activationRequest);
        if (isActivated) {
            return ResponseEntity.ok("Account activated successfully. You can now log in.");
        } else {
            return ResponseEntity.badRequest().body("Activation failed. Please check your details and try again.");
        }
    }

    // This endpoint for login is correct
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
        Optional<String> tokenOptional = authService.login(loginRequest);
        if (tokenOptional.isPresent()) {
            return ResponseEntity.ok(new LoginResponseDTO(tokenOptional.get()));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials or account not active.");
        }
    }

    // ===============================================================
    // <<<--- THIS IS THE SINGLE, CORRECT VERSION OF THE METHOD ---<<<
    // ===============================================================
    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @RequestHeader("X-User-ID") String employeeId,
            @RequestBody ChangePasswordRequestDTO request) {

        boolean isChanged = authService.changePassword(employeeId, request);

        if (isChanged) {
            return ResponseEntity.ok("Password changed successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Failed to change password. Please check if your current password is correct.");
        }
    }
}