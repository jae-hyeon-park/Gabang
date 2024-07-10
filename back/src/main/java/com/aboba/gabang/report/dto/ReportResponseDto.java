package com.aboba.gabang.report.dto;

import com.aboba.gabang.report.model.Report;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ReportResponseDto {

    private Long reportId;

    private String reportTitle;

    private String reportDetail;

    private String reportType;

    private LocalDateTime registrationDate;

    private String userId;

    private String sellerId;

    public ReportResponseDto(Report report) {
        this.reportId = report.getReportId();
        this.reportTitle = report.getReportTitle();
        this.reportDetail = report.getReportDetail();
        this.reportType = report.getReportType();
        this.registrationDate = report.getRegistrationDate();
        this.userId = report.getUser().getUserId();
        this.sellerId = report.getProduct().getSeller().getUserId();
    }
}