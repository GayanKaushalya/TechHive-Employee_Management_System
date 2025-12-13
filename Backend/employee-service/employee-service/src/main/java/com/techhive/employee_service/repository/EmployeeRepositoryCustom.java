package com.techhive.employee_service.repository;

import java.util.List;
import com.techhive.employee_service.dto.DepartmentEmployeeDTO;
import com.techhive.employee_service.model.Employee;

public interface EmployeeRepositoryCustom {
    List<Object[]> getRawDashboardData(String employeeId);

    List<Employee> getAllEmployees();

    List<DepartmentEmployeeDTO> getEmployeesByDepartment(Integer departmentId);
}