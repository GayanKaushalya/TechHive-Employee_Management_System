package com.techhive.employee_service.repository;

import com.techhive.employee_service.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Integer>, DepartmentRepositoryCustom {

    @Procedure(procedureName = "ADD_DEPARTMENT_SP")
    Integer addDepartmentProcedure(@Param("p_department_name") String departmentName);

    @Procedure(name = "getAllDepartments")
    List<Department> getAllDepartmentsProcedure();

    @Procedure(name = "getAllDepartmentsWithCount")
    List<Department> getAllDepartmentsWithCountProcedure();

    @Procedure(procedureName = "UPDATE_DEPARTMENT_SP")
    long updateDepartmentProcedure(
            @Param("p_department_id") Integer departmentId,
            @Param("p_new_name") String newName
    );

    @Procedure(procedureName = "DELETE_DEPARTMENT_SP")
    long deleteDepartmentProcedure(@Param("p_department_id") Integer departmentId);
}