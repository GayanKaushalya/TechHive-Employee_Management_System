package com.techhive.employee_service.repository;

import com.techhive.employee_service.model.Department;
import java.util.List;

public interface DepartmentRepositoryCustom {
    List<Department> getAllDepartmentsWithCount();
}