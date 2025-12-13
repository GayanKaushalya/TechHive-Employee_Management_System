package com.techhive.auth_service.service;

import com.techhive.auth_service.dto.ActivationRequestDTO;
import com.techhive.auth_service.dto.ChangePasswordRequestDTO;
import com.techhive.auth_service.dto.LoginDetailsDTO;
import com.techhive.auth_service.dto.LoginRequestDTO;
import com.techhive.auth_service.dto.PasswordChangeDetailsDTO; // Import the correct DTO
import com.techhive.auth_service.repository.AuthRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private AuthRepository authRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    // This method is correct and unchanged
    @Transactional
    public boolean activateAccount(ActivationRequestDTO activationRequest) {
        String hashedPassword = passwordEncoder.encode(activationRequest.getNewPassword());
        long updatedCount = authRepository.activateAccountProcedure(
                activationRequest.getEmail(),
                activationRequest.getTemporaryPassword(),
                hashedPassword
        );
        return updatedCount > 0;
    }

    // This method is also correct and unchanged
    @Transactional(readOnly = true)
    public Optional<String> login(LoginRequestDTO loginRequest) {
        List<LoginDetailsDTO> results = authRepository.getLoginDetailsProcedure(loginRequest.getEmail());
        if (results.isEmpty()) {
            return Optional.empty();
        }
        LoginDetailsDTO userDetails = results.get(0);
        if (passwordEncoder.matches(loginRequest.getPassword(), userDetails.getPasswordHash())
                && "ACTIVE".equals(userDetails.getAccountStatus())) {
            String token = jwtService.generateToken(
                    userDetails.getEmployeeId(),
                    userDetails.getEmail(),
                    userDetails.getRole(),
                    userDetails.getFullName()
            );
            return Optional.of(token);
        }
        return Optional.empty();
    }

    // ===============================================================
    // <<<--- THIS IS THE CORRECTED METHOD ---<<<
    // ===============================================================
    @Transactional
    public boolean changePassword(String employeeId, ChangePasswordRequestDTO request) {
        // --- THIS IS THE CHANGE ---
        // Call the renamed repository method
        List<PasswordChangeDetailsDTO> results = authRepository.callGetLoginDetailsByIdProcedure(employeeId);
        if (results.isEmpty()) {
            return false;
        }

        // The 'userDetails' variable is also now the correct type.
        PasswordChangeDetailsDTO userDetails = results.get(0);

        // Step 2: VERIFY the current password.
        if (!passwordEncoder.matches(request.getCurrentPassword(), userDetails.getPasswordHash())) {
            return false;
        }

        // Step 3: Hash the NEW password.
        String newPasswordHash = passwordEncoder.encode(request.getNewPassword());

        // Step 4: Call the stored procedure to update the password.
        long updatedCount = authRepository.changePasswordProcedure(employeeId, newPasswordHash);

        // Step 5: Return true if successful.
        return updatedCount > 0;
    }
}