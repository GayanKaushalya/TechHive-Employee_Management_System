package com.techhive.reporting_service.dto;
import lombok.Data;
@Data
public class DepartmentDetailsDTO {
    private Integer departmentId;
    private String departmentName;
    private Long employeeCount;
}