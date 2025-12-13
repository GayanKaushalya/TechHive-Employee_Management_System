package com.techhive.project_service.model;

import jakarta.persistence.*;
import lombok.Data;

@NamedStoredProcedureQuery(
        name = "getAssignmentsByEmployee",
        procedureName = "GET_ASSIGNMENTS_BY_EMPLOYEE_SP",
        resultClasses = ProjectAssignment.class,
        parameters = {
                @StoredProcedureParameter(mode = ParameterMode.IN, name = "p_employee_id", type = String.class),
                @StoredProcedureParameter(mode = ParameterMode.REF_CURSOR, name = "p_assignment_cursor", type = void.class)
        }
)


@Entity
@Table(name = "PROJECT_ASSIGNMENTS")
@Data
public class ProjectAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ASSIGNMENT_ID")
    private Long assignmentId;

    @Column(name = "PROJECT_ID", nullable = false)
    private String projectId;

    @Column(name = "EMPLOYEE_ID", nullable = false)
    private String employeeId;
}