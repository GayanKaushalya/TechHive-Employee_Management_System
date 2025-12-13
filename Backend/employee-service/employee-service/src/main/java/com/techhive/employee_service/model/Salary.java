package com.techhive.employee_service.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

// All @SqlResultSetMapping and @NamedStoredProcedureQuery annotations have been REMOVED.

@Entity
@Table(name = "SALARIES")
@Data
public class Salary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SALARY_ID")
    private Long salaryId;

    @Column(name = "EMPLOYEE_ID", nullable = false, unique = true)
    private String employeeId;

    @Column(name = "AMOUNT", nullable = false)
    private BigDecimal amount;

    @Column(name = "PAY_FREQUENCY", nullable = false)
    private String payFrequency;

    @Column(name = "EFFECTIVE_DATE", nullable = false)
    private LocalDate effectiveDate;

    @Transient
    private String firstName;

    @Transient
    private String lastName;
}