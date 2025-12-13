package com.techhive.reporting_service.repository;

import com.techhive.reporting_service.dto.EmployeeDirectoryDTO;
import com.techhive.reporting_service.dto.MasterSalaryDTO;
import com.techhive.reporting_service.dto.ProjectStatusDTO;
import com.techhive.reporting_service.modal.DummyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<DummyEntity, Long>, ReportRepositoryCustom {

    @Procedure(name = "getEmployeeDirectoryData")
    List<EmployeeDirectoryDTO> getEmployeeDirectoryData();

    @Procedure(name = "getMasterSalaryData")
    List<MasterSalaryDTO> getMasterSalaryData();

    @Procedure(name = "getProjectStatusData")
    List<ProjectStatusDTO> getProjectStatusData();
}