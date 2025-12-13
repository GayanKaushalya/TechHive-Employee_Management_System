package com.techhive.reporting_service.modal;

import jakarta.persistence.*;
import lombok.Data;

// This is the mapping for our stored procedure that fetches the report data.
@NamedStoredProcedureQuery(
        name = "getEmployeeDirectoryData",
        procedureName = "GET_EMPLOYEE_DIRECTORY_DATA_SP",
        resultSetMappings = "EmployeeDirectoryMapping", // We will map the results using this mapping
        parameters = {
                @StoredProcedureParameter(mode = ParameterMode.REF_CURSOR, name = "p_directory_cursor", type = void.class)
        }
)
@SqlResultSetMapping(
        name = "EmployeeDirectoryMapping",
        classes = @ConstructorResult( // Map the results to the constructor of our DTO
                targetClass = com.techhive.reporting_service.dto.EmployeeDirectoryDTO.class,
                columns = {
                        @ColumnResult(name = "employee_id", type = String.class),
                        @ColumnResult(name = "full_name", type = String.class),
                        @ColumnResult(name = "email", type = String.class),
                        @ColumnResult(name = "job_title", type = String.class),
                        @ColumnResult(name = "hire_date", type = java.time.LocalDate.class),
                        @ColumnResult(name = "department_name", type = String.class)
                }
        )
)
@NamedStoredProcedureQuery(
        name = "getMasterSalaryData",
        procedureName = "GET_MASTER_SALARY_DATA_SP",
        resultSetMappings = "MasterSalaryMapping",
        parameters = {
                @StoredProcedureParameter(mode = ParameterMode.REF_CURSOR, name = "p_salary_cursor", type = void.class)
        }
)
// <<<--- AND ADD THIS NEW RESULT SET MAPPING ---<<<
@SqlResultSetMapping(
        name = "MasterSalaryMapping",
        classes = @ConstructorResult(
                targetClass = com.techhive.reporting_service.dto.MasterSalaryDTO.class,
                columns = {
                        @ColumnResult(name = "employee_id", type = String.class),
                        @ColumnResult(name = "full_name", type = String.class),
                        @ColumnResult(name = "job_title", type = String.class),
                        @ColumnResult(name = "department_name", type = String.class),
                        @ColumnResult(name = "amount", type = java.math.BigDecimal.class),
                        @ColumnResult(name = "pay_frequency", type = String.class),
                        @ColumnResult(name = "effective_date", type = java.time.LocalDate.class)
                }
        )
)
@NamedStoredProcedureQuery(
        name = "getProjectStatusData",
        procedureName = "GET_PROJECT_STATUS_DATA_SP",
        resultSetMappings = "ProjectStatusMapping",
        parameters = {
                @StoredProcedureParameter(mode = ParameterMode.REF_CURSOR, name = "p_project_cursor", type = void.class)
        }
)
// <<<--- AND ADD THIS NEW RESULT SET MAPPING ---<<<
@SqlResultSetMapping(
        name = "ProjectStatusMapping",
        classes = @ConstructorResult(
                targetClass = com.techhive.reporting_service.dto.ProjectStatusDTO.class,
                columns = {
                        @ColumnResult(name = "project_id", type = String.class),
                        @ColumnResult(name = "project_name", type = String.class),
                        @ColumnResult(name = "status", type = String.class),
                        @ColumnResult(name = "start_date", type = java.time.LocalDate.class),
                        @ColumnResult(name = "end_date", type = java.time.LocalDate.class),
                        @ColumnResult(name = "assigned_employee_count", type = Long.class)
                }
        )
)
@Entity
@Data
public class DummyEntity {
    @Id
    private Long id;
}