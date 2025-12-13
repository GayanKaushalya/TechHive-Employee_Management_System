package com.techhive.employee_service.service;

import com.techhive.employee_service.model.Department;
import com.techhive.employee_service.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    // This method for adding a department is still correct and does not need changes.
    @Transactional
    public Department addDepartment(Department department) {
        Integer newId = departmentRepository.addDepartmentProcedure(department.getDepartmentName());
        department.setDepartmentId(newId);
        return department;
    }

    // ===============================================================
    // <<<--- THIS IS THE UPDATED METHOD ---<<<
    // It now calls our new custom repository method.
    // ===============================================================
    @Transactional(readOnly = true)
    public List<Department> getAllDepartments() {
        return departmentRepository.getAllDepartmentsWithCount();
    }

    @Transactional
    public long updateDepartment(Integer departmentId, Department departmentDetails) {
        return departmentRepository.updateDepartmentProcedure(departmentId, departmentDetails.getDepartmentName());
    }

    @Transactional
    public long deleteDepartment(Integer departmentId) {
        return departmentRepository.deleteDepartmentProcedure(departmentId);
    }

}