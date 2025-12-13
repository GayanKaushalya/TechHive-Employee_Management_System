package com.techhive.reporting_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MasterSalaryDTO {
    private String employeeId;
    private String fullName;
    private String jobTitle;
    private String departmentName;
    private BigDecimal amount;
    private String payFrequency;
    private LocalDate effectiveDate;
}