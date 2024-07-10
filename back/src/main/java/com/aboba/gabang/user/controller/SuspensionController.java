package com.aboba.gabang.user.controller;

import com.aboba.gabang.user.dto.SuspensionRequestDto;
import com.aboba.gabang.user.model.Suspension;
import com.aboba.gabang.user.service.SuspensionService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class SuspensionController {

    private final SuspensionService suspensionService;

//    @Autowired
//    public SuspensionController(SuspensionService suspensionService) {
//        this.suspensionService = suspensionService;
//    }

    @GetMapping("/users/check-suspension-phone/{phoneNumber}")
    public ResponseEntity<Boolean> checkSuspensionByPhoneNumber(@PathVariable String phoneNumber) {
        boolean isUnderSuspension = suspensionService.existsSuspensionsByUserPhoneNumber(phoneNumber);
        return ResponseEntity.ok(isUnderSuspension);
    }

    @GetMapping("/users/check-suspension-id/{userId}")
    public ResponseEntity<Boolean> checkSuspensionByUserId(@PathVariable String userId) {
        boolean isUnderSuspension = suspensionService.existsSuspensionsByUserId(userId);
        return ResponseEntity.ok(isUnderSuspension);
    }

    @PostMapping("/admin/suspensions")
    public ResponseEntity<String> saveSuspensionDate(@RequestBody SuspensionRequestDto suspensionDto) {
        try {
            suspensionService.saveSuspension(suspensionDto);
            return ResponseEntity.status(HttpStatus.OK)
                    .body("정지 기간이 설정되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("다시 시도하세요.");
        }
    }
}
