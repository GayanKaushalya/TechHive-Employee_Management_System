package com.techhive.employee_service.dto;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class SalaryInfoDTO {
    private String employeeId;
    private String firstName;
    private String lastName;
    private BigDecimal amount;
    private String payFrequency;
    private LocalDate effectiveDate;
}