package com.aboba.gabang.report.repository;

import com.aboba.gabang.product.dto.ProductResponseDTO;
import com.aboba.gabang.report.dto.ReportResponseDto;
import com.aboba.gabang.report.model.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReportRepository extends JpaRepository<Report, Long> {


    @Query("SELECT new com.aboba.gabang.report.dto.ReportResponseDto(r) FROM Report r WHERE r.reportTitle LIKE CONCAT('%', :searchKeyword, '%')")
    Page<ReportResponseDto> findAllByReportTitleContaining(String searchKeyword, Pageable pageable);

    @Query("SELECT new com.aboba.gabang.report.dto.ReportResponseDto(r) FROM Report r WHERE r.user.userId = :userId ORDER BY registrationDate DESC")
    Page<ReportResponseDto> findByUserId(@Param("userId") String userId, Pageable pageable);

    @Query("SELECT new com.aboba.gabang.report.dto.ReportResponseDto(r) FROM Report r WHERE r.user.userId = :userId AND r.reportTitle LIKE CONCAT('%', :searchKeyword, '%')")
    Page<ReportResponseDto> findByReportTitleContaining(String userId, String searchKeyword, Pageable pageable);
}
