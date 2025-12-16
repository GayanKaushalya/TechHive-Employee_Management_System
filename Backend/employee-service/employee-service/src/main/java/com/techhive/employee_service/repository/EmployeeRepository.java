package com.techhive.employee_service.repository;

import com.techhive.employee_service.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.techhive.employee_service.dto.EmployeeDashboardDTO;
import com.techhive.employee_service.dto.CredentialsDTO;
import com.techhive.employee_service.dto.AvailableEmployeeDTO;
import com.techhive.employee_service.dto.DepartmentEmployeeDTO;
import java.time.LocalDate;
import java.util.List;


@Repository
public interface EmployeeRepository extends JpaRepository<Employee, String>, EmployeeRepositoryCustom {

    // THE FIX: Using "procedureName" to force the exact name
    @Procedure(procedureName = "ADD_EMPLOYEE_SP")
    String addEmployeeProcedure(
            @Param("p_first_name") String firstName,
            @Param("p_last_name") String lastName,
            @Param("p_email") String email,
            @Param("p_phone_number") String phoneNumber,
            @Param("p_hire_date") LocalDate hireDate,
            @Param("p_job_title") String jobTitle,

            @Param("p_department_id") Integer departmentId
    );
    @Procedure(procedureName = "UPDATE_EMPLOYEE_SP")
    long updateEmployeeProcedure(
            @Param("p_employee_id") String employeeId,
            @Param("p_first_name") String firstName,
            @Param("p_last_name") String lastName,
            @Param("p_email") String email,
            @Param("p_phone_number") String phoneNumber,
            @Param("p_job_title") String jobTitle,
            @Param("p_department_id") Integer departmentId
    );

    // <<<--- AND ADD THIS METHOD ---<<<
    @Procedure(procedureName = "DELETE_EMPLOYEE_SP")
    long deleteEmployeeProcedure(@Param("p_employee_id") String employeeId);


    // <<<--- ADD THIS METHOD (replaces findAll) ---<<<


    // <<<--- ADD THIS METHOD (replaces findById) ---<<<
    @Procedure(name = "getEmployeeById")
    List<Employee> getEmployeeByIdProcedure(@Param("p_employee_id") String employeeId);

    @Procedure(name = "getEmployeeDashboard")
     List<EmployeeDashboardDTO> getEmployeeDashboardProcedure(@Param("p_employee_id") String employeeId);

    @Procedure(name = "getEmployeeCredentials")
    List<CredentialsDTO> getEmployeeCredentialsProcedure(@Param("p_employee_id") String employeeId);

    @Procedure(name = "getAvailableEmployees")
    List<AvailableEmployeeDTO> getAvailableEmployeesProcedure();

    //@Procedure(name = "getEmployeesByDepartment")
    //List<DepartmentEmployeeDTO> getEmployeesByDepartmentProcedure(@Param("p_department_id") Integer departmentId);

}