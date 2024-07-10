package com.aboba.gabang.report.controller;

import com.aboba.gabang.report.dto.ReportRequestDTO;
import com.aboba.gabang.report.dto.ReportResponseDto;
import com.aboba.gabang.report.model.Report;
import com.aboba.gabang.report.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/admin/reports")
    public ResponseEntity<Page<ReportResponseDto>> getReportsAdmin(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Page<ReportResponseDto> reports = reportService.findAll(search, page, size);
        return ResponseEntity.ok()
                .body(reports);
    }

    @GetMapping("/reports/{userId}")
    public ResponseEntity<Page<ReportResponseDto>> getReportsUser(
            @PathVariable("userId") String userId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Page<ReportResponseDto> reports = reportService.findByUserId(userId, search, page, size);
        return ResponseEntity.ok()
                .body(reports);
    }

    // 신고 등록
    @PostMapping("/reports")
    public Report createReport(@RequestBody ReportRequestDTO reportRequestDTO) {
        return reportService.createReport(reportRequestDTO);
    }

}
