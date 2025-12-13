package com.techhive.auth_service.modal;

import com.techhive.auth_service.dto.LoginDetailsDTO;
import com.techhive.auth_service.dto.PasswordChangeDetailsDTO;
import jakarta.persistence.*;
import lombok.Data;

// ===============================================================
// <<<--- THIS IS THE FULL, CORRECTED ANNOTATION BLOCK ---<<<
// ===============================================================

// --- Mappings for our DTOs ---
@SqlResultSetMapping(
        name = "LoginDetailsMapping",
        classes = @ConstructorResult(targetClass = LoginDetailsDTO.class, columns = {
                @ColumnResult(name = "employee_id", type = String.class),
                @ColumnResult(name = "email", type = String.class),
                @ColumnResult(name = "password_hash", type = String.class),
                @ColumnResult(name = "role", type = String.class),
                @ColumnResult(name = "account_status", type = String.class),
                @ColumnResult(name = "full_name", type = String.class)
        })
)
@SqlResultSetMapping(
        name = "PasswordChangeDetailsMapping",
        classes = @ConstructorResult(targetClass = PasswordChangeDetailsDTO.class, columns = {
                @ColumnResult(name = "password_hash", type = String.class),
                @ColumnResult(name = "account_status", type = String.class)
        })
)

// --- A SINGLE wrapper for ALL our named queries ---
@NamedStoredProcedureQueries({
        // Query 1: For logging in via email
        @NamedStoredProcedureQuery(
                name = "getLoginDetails",
                procedureName = "GET_LOGIN_DETAILS_BY_EMAIL_SP",
                resultSetMappings = "LoginDetailsMapping",
                parameters = {
                        @StoredProcedureParameter(mode = ParameterMode.IN, name = "p_email", type = String.class),
                        @StoredProcedureParameter(mode = ParameterMode.REF_CURSOR, name = "p_login_cursor", type = void.class)
                }
        ),
        // Query 2: For verifying the current password via employee ID
        @NamedStoredProcedureQuery(
                name = "getLoginDetailsById", // This name is now unique
                procedureName = "GET_LOGIN_DETAILS_BY_ID_SP",
                resultSetMappings = "PasswordChangeDetailsMapping",
                parameters = {
                        @StoredProcedureParameter(mode = ParameterMode.IN, name = "p_employee_id", type = String.class),
                        @StoredProcedureParameter(mode = ParameterMode.REF_CURSOR, name = "p_login_cursor", type = void.class)
                }
        )
})
@Entity
@Data
public class DummyEntity {
    @Id
    private Long id;
}