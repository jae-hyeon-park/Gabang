package com.aboba.gabang.report.dto;

import com.aboba.gabang.report.model.Report;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReportRequestDTO {
    private String userId;
    private Integer productId;
    private String reportTitle;
    private String reportType;
    private String reportDetail;
}
