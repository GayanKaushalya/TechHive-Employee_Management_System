package com.techhive.feedback_service.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.Map;

// @Document maps this class to a MongoDB collection named "feedback".
@Document(collection = "feedback")
@Data
public class Feedback {

    // @Id marks this field as the primary key. MongoDB will auto-generate a unique value.
    @Id
    private String id;

    // @Field maps this Java field to a field in the MongoDB document.
    // It's good practice to use it, but often optional if the names match.
    @Field("submitter_employee_id")
    private String submitterEmployeeId;

    @Field("target_employee_id")
    private String targetEmployeeId;

    @Field("project_id")
    private String projectId; // Optional: can be null if feedback is not project-related

    @Field("is_anonymous")
    private boolean isAnonymous;

    // This is where the flexibility comes in. We can store any key-value pairs here.
    // e.g., {"rating": 5, "comment": "Great work!"}
    @Field("content")
    private Map<String, Object> content;

    @Field("submitted_at")
    private LocalDateTime submittedAt;
}