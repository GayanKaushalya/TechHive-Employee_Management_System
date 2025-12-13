package com.techhive.feedback_service.service;

import com.techhive.feedback_service.model.Feedback;
import com.techhive.feedback_service.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    /**
     * Saves a new piece of feedback to the database.
     * @param feedback The feedback object to save.
     * @return The saved feedback object, now with an ID and submission date.
     */
    public Feedback submitFeedback(Feedback feedback) {
        // Business logic: always set the current timestamp before saving.
        feedback.setSubmittedAt(LocalDateTime.now());
        return feedbackRepository.save(feedback);
    }

    // <<<--- ADD THIS METHOD ---<<<
    /**
     * Retrieves all feedback submitted ABOUT a specific employee.
     * @param employeeId The ID of the employee who is the target of the feedback.
     * @return A list of feedback documents.
     */
    public List<Feedback> getFeedbackForEmployee(String employeeId) {
        return feedbackRepository.findByTargetEmployeeId(employeeId);
    }

    // <<<--- AND ADD THIS METHOD ---<<<
    /**
     * Retrieves all feedback submitted BY a specific employee.
     * @param employeeId The ID of the employee who submitted the feedback.
     * @return A list of feedback documents.
     */
    public List<Feedback> getFeedbackByEmployee(String employeeId) {
        return feedbackRepository.findBySubmitterEmployeeId(employeeId);
    }

    /**
     * Retrieves all feedback documents from the database.
     * @return A list of all feedback.
     */
    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }
}