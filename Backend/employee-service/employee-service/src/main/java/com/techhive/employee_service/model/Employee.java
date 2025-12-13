package com.techhive.employee_service.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;


@Entity
@Table(name = "EMPLOYEES")
@Data
public class Employee {

    @Id
    @Column(name = "EMPLOYEE_ID")
    private String employeeId;

    @Column(name = "FIRST_NAME", nullable = false)
    private String firstName;

    @Column(name = "LAST_NAME", nullable = false)
    private String lastName;

    @Column(name = "EMAIL", nullable = false, unique = true)
    private String email;

    @Column(name = "PHONE_NUMBER")
    private String phoneNumber;

    @Column(name = "HIRE_DATE", nullable = false)
    private LocalDate hireDate;

    @Column(name = "JOB_TITLE")
    private String jobTitle;

    @Column(name = "PASSWORD_HASH", nullable = false)
    private String passwordHash;

    @Column(name = "DEPARTMENT_ID")
    private Integer departmentId;

    // <<<--- ADD THIS FIELD ---<<<
    @Column(name = "ROLE", nullable = false)
    private String role;

    // <<<--- AND ADD THIS FIELD ---<<<
    @Column(name = "ACCOUNT_STATUS", nullable = false)
    private String accountStatus;

    @Transient
    private String departmentName;
}