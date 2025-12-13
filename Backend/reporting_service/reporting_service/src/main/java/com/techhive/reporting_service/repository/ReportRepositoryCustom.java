package com.techhive.reporting_service.repository;

import java.util.Map;
import java.util.List;

public interface ReportRepositoryCustom {
    // This will return a Map containing two lists: one for details, one for the team
    Map<String, List<?>> getProjectAssignmentData(String projectId);

    Map<String, List<?>> getDepartmentDetailData(Integer departmentId);
}