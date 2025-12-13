package com.techhive.employee_service.service;

import com.techhive.employee_service.dto.ProjectAssignmentDTO;

import com.techhive.employee_service.dto.ProjectDTO;
import com.techhive.employee_service.model.Employee;
import com.techhive.employee_service.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import com.techhive.employee_service.dto.EmployeeDashboardDTO; // Import
import com.techhive.employee_service.dto.CredentialsDTO;
import com.techhive.employee_service.dto.AvailableEmployeeDTO;
import com.techhive.employee_service.model.Salary; // Import
import com.techhive.employee_service.dto.DepartmentEmployeeDTO;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired // <<<--- INJECT THE WEBCLIENT BEAN
    private WebClient projectServiceWebClient;

    @Autowired // <<<--- INJECT THE SALARY SERVICE
    private SalaryService salaryService;

    @Transactional
    public Employee addEmployee(Employee employee) {
        String placeholderPasswordHash = "!placeholder_password_hash!";

        String generatedId = employeeRepository.addEmployeeProcedure(
                employee.getFirstName(),
                employee.getLastName(),
                employee.getEmail(),
                employee.getPhoneNumber(),
                employee.getHireDate(),
                employee.getJobTitle(),
                employee.getDepartmentId()
        );

        employee.setEmployeeId(generatedId);
        employee.setPasswordHash(null);
        employee.setRole("EMPLOYEE");
        employee.setAccountStatus("PENDING_ACTIVATION");
        return employee;
    }

    @Transactional(readOnly = true)
    public List<Employee> getAllEmployees() {
        // Call the new custom repository method
        return employeeRepository.getAllEmployees();
    }

    @Transactional(readOnly = true)
    public Optional<Employee> getEmployeeById(String employeeId) {
        // The procedure returns a list, but we expect it to contain 0 or 1 employees.
        List<Employee> employees = employeeRepository.getEmployeeByIdProcedure(employeeId);
        return employees.stream().findFirst();
    }

    // <<<--- ADD THIS NEW METHOD ---<<<
    /**
     * Fetches the list of project assignments for a given employee by calling the project-service.
     * @param employeeId The ID of the employee.
     * @return A List of ProjectAssignmentDTOs.
     */
    public List<ProjectAssignmentDTO> getAssignedProjectsForEmployee(String employeeId) {
        // Use the WebClient to make a GET request to the project-service
        Flux<ProjectAssignmentDTO> response = projectServiceWebClient.get()
                .uri("/assignments/employee/{employeeId}", employeeId) // The specific endpoint
                .retrieve() // Execute the request
                .bodyToFlux(ProjectAssignmentDTO.class); // Convert the response body to a stream of DTOs

        // Block and collect the results into a List.
        // In a fully reactive application, we wouldn't block, but for this REST-to-REST call, it's the simplest approach.
        return response.collectList().block();
    }

    @Transactional
    public long updateEmployee(String employeeId, Employee employeeDetails) {
        return employeeRepository.updateEmployeeProcedure(
                employeeId,
                employeeDetails.getFirstName(),
                employeeDetails.getLastName(),
                employeeDetails.getEmail(),
                employeeDetails.getPhoneNumber(),
                employeeDetails.getJobTitle(),
                employeeDetails.getDepartmentId()
        );
    }

    // <<<--- AND ADD THIS METHOD ---<<<
    @Transactional
    public long deleteEmployee(String employeeId) {
        return employeeRepository.deleteEmployeeProcedure(employeeId);
    }

    @Transactional(readOnly = true)
    public Optional<EmployeeDashboardDTO> getEmployeeDashboard(String employeeId) {
        List<Object[]> results = employeeRepository.getRawDashboardData(employeeId);

        if (results.isEmpty()) {
            return Optional.empty();
        }

        EmployeeDashboardDTO dashboard = new EmployeeDashboardDTO();
        Object[] firstRow = results.get(0);

        // --- SAFE CASTING with the CORRECT Type ---
        dashboard.setEmployeeId(firstRow[0] != null ? (String) firstRow[0] : null);
        dashboard.setFirstName(firstRow[1] != null ? (String) firstRow[1] : null);
        dashboard.setLastName(firstRow[2] != null ? (String) firstRow[2] : null);
        dashboard.setEmail(firstRow[3] != null ? (String) firstRow[3] : null);
        dashboard.setJobTitle(firstRow[4] != null ? (String) firstRow[4] : null);

        // <<<--- THE FIX: We now correctly cast to Integer, not BigDecimal ---<<<
        if (firstRow[5] != null) {
            dashboard.setDepartmentId((Integer) firstRow[5]);
        }

        dashboard.setDepartmentName(firstRow[6] != null ? (String) firstRow[6] : null);

        for (Object[] row : results) {
            String projectId = row[7] != null ? (String) row[7] : null;
            if (projectId != null) {
                dashboard.getProjects().add(new ProjectDTO(
                        projectId,
                        row[8] != null ? (String) row[8] : null,
                        row[9] != null ? (String) row[9] : null
                ));
            }
        }

        Optional<Salary> salaryOpt = salaryService.getSalaryByEmployeeId(employeeId);
        salaryOpt.ifPresent(dashboard::setSalary);

        return Optional.of(dashboard);
    }

    @Transactional(readOnly = true)
    public Optional<CredentialsDTO> getEmployeeCredentials(String employeeId) {
        return employeeRepository.getEmployeeCredentialsProcedure(employeeId).stream().findFirst();
    }

    @Transactional(readOnly = true)
    public List<AvailableEmployeeDTO> getAvailableEmployees() {
        return employeeRepository.getAvailableEmployeesProcedure();
    }

    @Transactional(readOnly = true)
    public List<DepartmentEmployeeDTO> getEmployeesByDepartment(Integer departmentId) {
        return employeeRepository.getEmployeesByDepartmentProcedure(departmentId);
    }

}


