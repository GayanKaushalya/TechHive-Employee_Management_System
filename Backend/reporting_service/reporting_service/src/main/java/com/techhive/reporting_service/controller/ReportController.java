package com.techhive.reporting_service.controller;

import com.techhive.reporting_service.service.PdfGenerationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import java.io.ByteArrayInputStream;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {

    @Autowired
    private PdfGenerationService pdfGenerationService;
    public ReportController(PdfGenerationService pdfGenerationService) {
        this.pdfGenerationService = pdfGenerationService;
    }

    @GetMapping(value = "/employees/directory", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<InputStreamResource> getEmployeeDirectoryReport() {
        ByteArrayInputStream bis = pdfGenerationService.generateEmployeeDirectoryPdf();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=employee_directory.pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }

    @GetMapping(value = "/salaries/master", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<InputStreamResource> getMasterSalaryReport() {
        ByteArrayInputStream bis = pdfGenerationService.generateMasterSalaryPdf();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=master_salary_report.pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }

    // <<<--- ADD THIS NEW ENDPOINT ---<<<
    @GetMapping(value = "/projects/status", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<InputStreamResource> getProjectStatusReport() {
        ByteArrayInputStream bis = pdfGenerationService.generateProjectStatusPdf();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=project_status_report.pdf");

        return ResponseEntity.ok().headers(headers).contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }

    @GetMapping(value = "/projects/{projectId}/assignments", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<InputStreamResource> getProjectAssignmentReport(@PathVariable String projectId) {
        ByteArrayInputStream bis = pdfGenerationService.generateProjectAssignmentPdf(projectId);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=project_" + projectId + "_assignments.pdf");
        return ResponseEntity.ok().headers(headers).contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }


    @GetMapping(value = "/departments/{departmentId}/details", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<InputStreamResource> getDepartmentDetailReport(@PathVariable Integer departmentId) {
        ByteArrayInputStream bis = pdfGenerationService.generateDepartmentDetailPdf(departmentId);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=department_" + departmentId + "_report.pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }
}