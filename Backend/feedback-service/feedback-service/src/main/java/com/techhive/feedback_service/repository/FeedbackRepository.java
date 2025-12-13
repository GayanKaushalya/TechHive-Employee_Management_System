package com.techhive.feedback_service.repository;

import com.techhive.feedback_service.model.Feedback;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends MongoRepository<Feedback, String> {
    // MongoRepository<EntityType, PrimaryKeyType>

    // We can add custom query methods here later just by defining their signature,
    // for example, to find all feedback for a specific employee:
    List<Feedback> findByTargetEmployeeId(String employeeId);

    // This will generate a query that finds documents where the 'submitter_employee_id'
    // field matches the given employeeId.
    List<Feedback> findBySubmitterEmployeeId(String employeeId);
}