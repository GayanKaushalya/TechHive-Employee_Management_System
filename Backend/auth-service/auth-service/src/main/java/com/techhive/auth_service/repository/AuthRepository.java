package com.techhive.auth_service.repository;

import com.techhive.auth_service.dto.LoginDetailsDTO;
import com.techhive.auth_service.dto.PasswordChangeDetailsDTO;
import com.techhive.auth_service.modal.DummyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AuthRepository extends JpaRepository<DummyEntity, Long> {

    // For activating an account (This is correct)
    @Procedure(procedureName = "ACTIVATE_ACCOUNT_SP")
    long activateAccountProcedure(
            @Param("p_email") String email,
            @Param("p_temp_password") String temporaryPassword,
            @Param("p_new_password_hash") String newPasswordHash
    );

    // For logging in with an email (This is correct)
    @Procedure(name = "getLoginDetails")
    List<LoginDetailsDTO> getLoginDetailsProcedure(@Param("p_email") String email);

    // ===============================================================
    // <<<--- THIS IS THE CORRECTED METHOD SIGNATURE ---<<<
    // ===============================================================
    // For getting user details by ID (needed for password change verification)
    @Procedure(name = "getLoginDetailsById")
    List<PasswordChangeDetailsDTO> callGetLoginDetailsByIdProcedure(@Param("p_employee_id") String employeeId); // <<<--- THIS @Param IS THE FIX

    // For executing the password change (This is correct)
    @Procedure(procedureName = "CHANGE_PASSWORD_SP")
    long changePasswordProcedure(
            @Param("p_employee_id") String employeeId,
            @Param("p_new_password_hash") String newPasswordHash
    );
}