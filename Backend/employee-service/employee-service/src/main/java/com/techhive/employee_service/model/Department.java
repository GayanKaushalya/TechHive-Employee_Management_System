package com.techhive.employee_service.model;

import jakarta.persistence.*;
import lombok.Data;

// All @SqlResultSetMapping and @NamedStoredProcedureQuery annotations have been REMOVED.

@Entity
@Table(name = "DEPARTMENTS")
@Data
public class Department {

    @Id
    @Column(name = "DEPARTMENT_ID")
    private Integer departmentId;

    @Column(name = "DEPARTMENT_NAME", nullable = false, unique = true)
    private String departmentName;

    @Transient
    private Long employeeCount;
}