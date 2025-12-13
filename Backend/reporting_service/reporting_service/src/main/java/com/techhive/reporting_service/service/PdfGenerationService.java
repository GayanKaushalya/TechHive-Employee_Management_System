package com.techhive.reporting_service.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.UnitValue;
import com.techhive.reporting_service.dto.EmployeeDirectoryDTO;
import com.techhive.reporting_service.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.techhive.reporting_service.dto.MasterSalaryDTO;
import com.techhive.reporting_service.dto.ProjectStatusDTO;

import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.kernel.colors.ColorConstants;
import com.techhive.reporting_service.dto.ProjectDetailsDTO;
import com.techhive.reporting_service.dto.TeamMemberDTO;

import com.techhive.reporting_service.dto.DepartmentDetailsDTO;
import com.techhive.reporting_service.dto.DepartmentMemberDTO;
import java.util.List;
import java.util.Map;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;


@Service
public class PdfGenerationService {

    @Autowired
    private ReportRepository reportRepository;

    @Transactional(readOnly = true)
    public ByteArrayInputStream generateEmployeeDirectoryPdf() {
        // Step 1: Fetch the data from the database using our stored procedure.
        List<EmployeeDirectoryDTO> employees = reportRepository.getEmployeeDirectoryData();

        // Step 2: Create a PDF in memory.
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Step 3: Add content to the PDF.
        // Add a title
        document.add(new Paragraph("Employee Directory Report").setBold().setFontSize(18));

        // Define table structure
        float[] columnWidths = {1, 2, 3, 2, 2, 2}; // Relative column widths
        Table table = new Table(UnitValue.createPercentArray(columnWidths));
        table.setWidth(UnitValue.createPercentValue(100));
        table.setMarginTop(15);

        // Add table headers
        table.addHeaderCell(new Cell().add(new Paragraph("ID").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("Full Name").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("Email").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("Job Title").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("Hire Date").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("Department").setBold()));

        // Add data rows to the table
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        for (EmployeeDirectoryDTO emp : employees) {
            table.addCell(emp.getEmployeeId());
            table.addCell(emp.getFullName());
            table.addCell(emp.getEmail());
            table.addCell(emp.getJobTitle());
            table.addCell(emp.getHireDate().format(formatter));
            table.addCell(emp.getDepartmentName());
        }

        // Add the completed table to the document
        document.add(table);

        // Close the document
        document.close();

        // Step 4: Return the generated PDF as an InputStream.
        return new ByteArrayInputStream(out.toByteArray());
    }

    @Transactional(readOnly = true)
    public ByteArrayInputStream generateMasterSalaryPdf() {
        // Step 1: Fetch the data.
        List<MasterSalaryDTO> salaries = reportRepository.getMasterSalaryData();

        // Step 2: Create PDF in memory.
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Step 3: Add content.
        document.add(new Paragraph("Master Salary Report").setBold().setFontSize(18));
        document.add(new Paragraph("Confidential").setItalic().setFontColor(com.itextpdf.kernel.colors.ColorConstants.RED));


        // Define table
        float[] columnWidths = {1, 2, 2, 2, 1.5f, 1.5f, 1.5f};
        Table table = new Table(UnitValue.createPercentArray(columnWidths));
        table.setWidth(UnitValue.createPercentValue(100)).setMarginTop(15);

        // Headers
        table.addHeaderCell(new Cell().add(new Paragraph("ID").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("Full Name").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("Job Title").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("Department").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("Amount").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("Frequency").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("Effective Date").setBold()));

        // Data rows
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        for (MasterSalaryDTO salary : salaries) {
            table.addCell(salary.getEmployeeId());
            table.addCell(salary.getFullName());
            table.addCell(salary.getJobTitle());
            table.addCell(salary.getDepartmentName());
            table.addCell(salary.getAmount().toString());
            table.addCell(salary.getPayFrequency());
            table.addCell(salary.getEffectiveDate().format(formatter));
        }

        document.add(table);
        document.close();

        // Step 4: Return stream.
        return new ByteArrayInputStream(out.toByteArray());
    }

    // <<<--- ADD THIS NEW METHOD ---<<<
    @Transactional(readOnly = true)
    public ByteArrayInputStream generateProjectStatusPdf() {
        List<ProjectStatusDTO> projects = reportRepository.getProjectStatusData();

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfDocument pdf = new PdfDocument(new PdfWriter(out));
        Document document = new Document(pdf);

        document.add(new Paragraph("Overall Project Status Report").setBold().setFontSize(18));

        float[] columnWidths = {1.5f, 3, 1.5f, 1.5f, 1.5f, 1};
        Table table = new Table(UnitValue.createPercentArray(columnWidths));
        table.setWidth(UnitValue.createPercentValue(100)).setMarginTop(15);

        table.addHeaderCell(new Cell().add(new Paragraph("Project ID").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("Project Name").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("Status").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("Start Date").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("End Date").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("Team Size").setBold()));

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        for (ProjectStatusDTO project : projects) {
            table.addCell(project.getProjectId());
            table.addCell(project.getProjectName());
            table.addCell(project.getStatus());
            table.addCell(project.getStartDate() != null ? project.getStartDate().format(formatter) : "N/A");
            table.addCell(project.getEndDate() != null ? project.getEndDate().format(formatter) : "N/A");
            table.addCell(project.getAssignedEmployeeCount().toString());
        }

        document.add(table);
        document.close();

        return new ByteArrayInputStream(out.toByteArray());
    }

    @Transactional(readOnly = true)
    public ByteArrayInputStream generateProjectAssignmentPdf(String projectId) {
        Map<String, List<?>> reportData = reportRepository.getProjectAssignmentData(projectId);
        List<ProjectDetailsDTO> detailsList = (List<ProjectDetailsDTO>) reportData.get("details");
        List<TeamMemberDTO> teamList = (List<TeamMemberDTO>) reportData.get("team");

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(new PdfDocument(new PdfWriter(out)));

        if (detailsList.isEmpty()) {
            document.add(new Paragraph("Project Not Found").setBold().setFontSize(18));
            document.close();
            return new ByteArrayInputStream(out.toByteArray());
        }

        ProjectDetailsDTO details = detailsList.get(0);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        // --- Header Section ---
        document.add(new Paragraph("Project Assignment Report").setBold().setFontSize(20).setMarginBottom(5));
        document.add(new Paragraph(details.getProjectName()).setItalic().setFontSize(16).setMarginBottom(20));

        // --- Details Table ---
        Table detailsTable = new Table(UnitValue.createPercentArray(new float[]{1, 3})).setWidth(UnitValue.createPercentValue(100));
        detailsTable.addCell(new Cell().add(new Paragraph("Project ID:")).setBold().setBorder(null));
        detailsTable.addCell(new Cell().add(new Paragraph(details.getProjectId())).setBorder(null));
        detailsTable.addCell(new Cell().add(new Paragraph("Status:")).setBold().setBorder(null));
        detailsTable.addCell(new Cell().add(new Paragraph(details.getStatus())).setBorder(null));
        detailsTable.addCell(new Cell().add(new Paragraph("Start Date:")).setBold().setBorder(null));
        detailsTable.addCell(new Cell().add(new Paragraph(details.getStartDate() != null ? details.getStartDate().format(formatter) : "N/A")).setBorder(null));
        detailsTable.addCell(new Cell().add(new Paragraph("Description:")).setBold().setBorder(null));
        detailsTable.addCell(new Cell().add(new Paragraph(details.getDescription() != null ? details.getDescription() : "N/A")).setBorder(null));
        document.add(detailsTable);

        // --- Team Roster Section ---
        document.add(new Paragraph("Assigned Team Roster").setBold().setFontSize(16).setMarginTop(25));
        Table teamTable = new Table(UnitValue.createPercentArray(new float[]{1, 2, 2, 3})).setWidth(UnitValue.createPercentValue(100)).setMarginTop(10);
        teamTable.addHeaderCell(new Cell().add(new Paragraph("ID").setBold()));
        teamTable.addHeaderCell(new Cell().add(new Paragraph("Full Name").setBold()));
        teamTable.addHeaderCell(new Cell().add(new Paragraph("Job Title").setBold()));
        teamTable.addHeaderCell(new Cell().add(new Paragraph("Email").setBold()));

        for(TeamMemberDTO member : teamList) {
            teamTable.addCell(member.getEmployeeId());
            teamTable.addCell(member.getFullName());
            teamTable.addCell(member.getJobTitle());
            teamTable.addCell(member.getEmail());
        }
        document.add(teamTable);

        document.close();
        return new ByteArrayInputStream(out.toByteArray());
    }

    @Transactional(readOnly = true)
    public ByteArrayInputStream generateDepartmentDetailPdf(Integer departmentId) {
        Map<String, List<?>> reportData = reportRepository.getDepartmentDetailData(departmentId);
        List<DepartmentDetailsDTO> detailsList = (List<DepartmentDetailsDTO>) reportData.get("details");
        List<DepartmentMemberDTO> membersList = (List<DepartmentMemberDTO>) reportData.get("members");

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(new PdfDocument(new PdfWriter(out)));

        if (detailsList.isEmpty()) {
            document.add(new Paragraph("Department Not Found").setBold().setFontSize(18));
            document.close();
            return new ByteArrayInputStream(out.toByteArray());
        }

        DepartmentDetailsDTO details = detailsList.get(0);

        // --- Header Section ---
        document.add(new Paragraph("Department Detail Report").setBold().setFontSize(20));
        document.add(new Paragraph(details.getDepartmentName()).setItalic().setFontSize(16).setMarginBottom(20));

        document.add(new Paragraph("Department ID: " + details.getDepartmentId()));
        document.add(new Paragraph("Total Employees: " + details.getEmployeeCount()));

        // --- Member Roster Section ---
        document.add(new Paragraph("Department Members").setBold().setFontSize(16).setMarginTop(25));
        Table memberTable = new Table(UnitValue.createPercentArray(new float[]{1.5f, 2, 2, 3})).setWidth(UnitValue.createPercentValue(100)).setMarginTop(10);

        memberTable.addHeaderCell(new Cell().add(new Paragraph("Employee ID").setBold()));
        memberTable.addHeaderCell(new Cell().add(new Paragraph("Full Name").setBold()));
        memberTable.addHeaderCell(new Cell().add(new Paragraph("Job Title").setBold()));
        memberTable.addHeaderCell(new Cell().add(new Paragraph("Email").setBold()));

        for(DepartmentMemberDTO member : membersList) {
            memberTable.addCell(member.getEmployeeId());
            memberTable.addCell(member.getFullName());
            memberTable.addCell(member.getJobTitle());
            memberTable.addCell(member.getEmail());
        }
        document.add(memberTable);

        document.close();
        return new ByteArrayInputStream(out.toByteArray());
    }

}