package com.aboba.gabang.report.service;


import com.aboba.gabang.product.model.Product;
import com.aboba.gabang.product.repository.ProductRepository;
import com.aboba.gabang.report.dto.ReportRequestDTO;
import com.aboba.gabang.report.dto.ReportResponseDto;
import com.aboba.gabang.report.model.Report;
import com.aboba.gabang.report.repository.ReportRepository;
import com.aboba.gabang.user.model.User;
import com.aboba.gabang.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public Page<ReportResponseDto> findAll(String searchKeyword, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);

        // 검색어 있는 경우
        if (searchKeyword != null && !searchKeyword.equals("null") && !searchKeyword.equals("undefined")) {
            return reportRepository.findAllByReportTitleContaining(searchKeyword, pageRequest);
        }

        Page<Report> reportsPage = reportRepository.findAll(pageRequest);
        return reportsPage.map(ReportResponseDto::new);
    }

    public Page<ReportResponseDto> findByUserId(String userId, String searchKeyword, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);

        // 검색어 있는 경우
        if (searchKeyword != null && !searchKeyword.equals("null") && !searchKeyword.equals("undefined")) {
            return reportRepository.findByReportTitleContaining(userId, searchKeyword, pageRequest);
        }

        return reportRepository.findByUserId(userId, pageRequest);
    }

    public Report createReport(ReportRequestDTO reportRequestDTO) {
        Optional<User> user = userRepository.findById(reportRequestDTO.getUserId());
        Optional<Product> product = productRepository.findById(reportRequestDTO.getProductId());

        if (user.isEmpty() || product.isEmpty()) {
            throw new RuntimeException("유효하지 않은 사용자 ID 또는 제품 ID");
        }

        Report report = new Report();
        report.setUser(user.get());
        report.setProduct(product.get());
        report.setReportTitle(reportRequestDTO.getReportTitle());
        report.setReportType(reportRequestDTO.getReportType());
        report.setReportDetail(reportRequestDTO.getReportDetail());
        report.setRegistrationDate(LocalDateTime.now());

        return reportRepository.save(report);
    }

}
