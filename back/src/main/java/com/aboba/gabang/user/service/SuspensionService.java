package com.aboba.gabang.user.service;

import com.aboba.gabang.product.model.Product;
import com.aboba.gabang.product.repository.ProductRepository;
import com.aboba.gabang.report.model.Report;
import com.aboba.gabang.report.repository.ReportRepository;
import com.aboba.gabang.user.dto.SuspensionRequestDto;
import com.aboba.gabang.user.dto.UserResponseAdminDto;
import com.aboba.gabang.user.model.Suspension;
import com.aboba.gabang.user.model.User;
import com.aboba.gabang.user.repository.SuspensionRepository;
import com.aboba.gabang.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SuspensionService {

    private final SuspensionRepository suspensionRepository;
    private final UserRepository userRepository;

    public boolean existsSuspensionsByUserPhoneNumber(String phoneNumber) {
        return suspensionRepository.existsSuspensionsByUserPhoneNumber(phoneNumber);
    }

    public boolean existsSuspensionsByUserId(String userId) {
        return suspensionRepository.existsSuspensionsByUserId(userId);
    }

    public void saveSuspension (SuspensionRequestDto suspensionDto) {
        String userId = suspensionDto.getUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("not found"));

        suspensionRepository.save(suspensionDto.toEntity(user));
    }
}
