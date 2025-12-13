package com.techhive.project_service.model;

// Add these two new imports
import org.hibernate.annotations.Generated;
import org.hibernate.annotations.GenerationTime;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;


@NamedStoredProcedureQueries({
        @NamedStoredProcedureQuery(
                name = "getAllProjects",
                procedureName = "GET_ALL_PROJECTS_SP",
                resultClasses = Project.class,
                parameters = {
                        @StoredProcedureParameter(mode = ParameterMode.REF_CURSOR, name = "p_project_cursor", type = void.class)
                }
        ),
        @NamedStoredProcedureQuery(
                name = "getProjectById",
                procedureName = "GET_PROJECT_BY_ID_SP",
                resultClasses = Project.class,
                parameters = {
                        @StoredProcedureParameter(mode = ParameterMode.IN, name = "p_project_id", type = String.class),
                        @StoredProcedureParameter(mode = ParameterMode.REF_CURSOR, name = "p_project_cursor", type = void.class)
                }
        )
})
@Entity
@Table(name = "PROJECTS")
@Data
public class Project {

    @Id
    // THE FIX, PART 1: This tells Hibernate the database will generate the value upon insert.
    @Generated(GenerationTime.INSERT)
    // THE FIX, PART 2: This tells Hibernate to not include this column in its INSERT/UPDATE statements.
    @Column(name = "PROJECT_ID", insertable = false, updatable = false)
    private String projectId;

    @Column(name = "PROJECT_NAME", nullable = false)
    private String projectName;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "START_DATE")
    private LocalDate startDate;

    @Column(name = "END_DATE")
    private LocalDate endDate;

    @Column(name = "STATUS", nullable = false)
    private String status;
}