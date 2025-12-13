package com.techhive.employee_service.controller;

import com.techhive.employee_service.model.Department;
import com.techhive.employee_service.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/departments")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @PostMapping
    public ResponseEntity<Department> createDepartment(@RequestBody Department department) {
        Department newDepartment = departmentService.addDepartment(department);
        return new ResponseEntity<>(newDepartment, HttpStatus.CREATED);
    }

    @GetMapping
    public List<Department> getAllDepartments() {
        return departmentService.getAllDepartments();
    }

    @PutMapping("/{departmentId}")
    public ResponseEntity<Void> updateDepartment(
            @PathVariable Integer departmentId,
            @RequestBody Department departmentDetails) {
        long updatedCount = departmentService.updateDepartment(departmentId, departmentDetails);
        if (updatedCount > 0) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{departmentId}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable Integer departmentId) {
        long deletedCount = departmentService.deleteDepartment(departmentId);
        if (deletedCount > 0) {
            return ResponseEntity.noContent().build();
        } else {
            // Return 400 Bad Request because the deletion failed due to the business rule
            return ResponseEntity.badRequest().build();
        }
    }
}