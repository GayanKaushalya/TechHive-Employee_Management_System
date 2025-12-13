package com.techhive.feedback_service.controller;

import com.techhive.feedback_service.model.Feedback;
import com.techhive.feedback_service.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/v1/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @Autowired
    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping
    public ResponseEntity<Feedback> submitFeedback(@RequestBody Feedback feedback) {
        Feedback savedFeedback = feedbackService.submitFeedback(feedback);
        return new ResponseEntity<>(savedFeedback, HttpStatus.CREATED);
    }

    // <<<--- ADD THIS ENDPOINT ---<<<
    // Example URL: /api/v1/feedback/for/TH-0002 (Gets feedback about Jane Smith)
    @GetMapping("/for/{employeeId}")
    public List<Feedback> getFeedbackForEmployee(@PathVariable String employeeId) {
        return feedbackService.getFeedbackForEmployee(employeeId);
    }

    // <<<--- AND ADD THIS ENDPOINT ---<<<
    // Example URL: /api/v1/feedback/by/TH-0001 (Gets feedback submitted by Gayan)
    @GetMapping("/by/{employeeId}")
    public List<Feedback> getFeedbackByEmployee(@PathVariable String employeeId) {
        return feedbackService.getFeedbackByEmployee(employeeId);
    }

    // <<<--- ADD THIS NEW ENDPOINT ---<<<
    /**
     * GET /api/v1/feedback
     * @return A list of all feedback documents in the system.
     */
    @GetMapping
    public List<Feedback> getAllFeedback() {
        return feedbackService.getAllFeedback();
    }
}