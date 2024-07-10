package com.aboba.gabang.trade.controller;

import com.aboba.gabang.account.service.AccountService;
//import com.aboba.gabang.product.dto.ProductRequestTradeStateDTO;
import com.aboba.gabang.product.service.ProductService;
import com.aboba.gabang.trade.dto.*;
import com.aboba.gabang.trade.service.TradeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class TradeController {
    private final TradeService tradeService;
    private final AccountService accountService;
    private final ProductService productService;

    @GetMapping("/products/my-purchased/{userId}")
    public ResponseEntity<Page<TradeResponseDto>> getMyPurchasedProduct(
            @PathVariable("userId") String userId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "all") String state,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Page<TradeResponseDto> trades = tradeService.findByBuyerId(userId, search, state, page, size);
        return ResponseEntity.ok()
                .body(trades);
    }

    @PostMapping("/trade/{tradeId}") // 구매확정
    public ResponseEntity<String> trade(@PathVariable int tradeId, @RequestBody TradeRequestPurchaseDTO dto) {

        if (tradeService.findById(tradeId).getTransactionCompletionTime() != null) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body("이미 구매확정된 상품입니다.");
        }

        //계좌 처리 로직
        String result = accountService.deposit(dto.getProductId());
        
        if(result.equals("해당 계좌없음")){
            return ResponseEntity.status(200)
                    .body("입금과정에서 문제 발생");
        }

        try {
            tradeService.updateTrade(tradeId); // 구매확정 시간 저장
            productService.updateState(dto.getProductId(), "3"); // 판매 완료로 상태 변경

            return ResponseEntity.status(200)
                    .body("구매확정 되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("다시 시도하세요.");
        }
    }

    @PostMapping("/payment")
    public ResponseEntity<?> pay(@RequestBody TradeDTO tradeDTO){
        try {
            String res = tradeService.createTrade(tradeDTO);

            return ResponseEntity.ok("{\"message\":\"" + res + "\"}"); // 상황에 맞게 HTTP 200과 함께 결과 반환
        } catch (Exception e) {
            // 실패 시 HTTP 400이나 다른 적절한 상태 코드 반환
            return ResponseEntity.badRequest().body("Error processing payment");
        }
    }

    @DeleteMapping("/payment")
    public void deletePayment(@RequestParam Integer productId) {
        tradeService.deleteTrade(productId);
    }

     // 송장번호 조회
    @GetMapping("/delivery")
    public ResponseEntity<?> getDeliveryInfo(@RequestParam Integer productId) {
        Optional<TradeResponseDto> tradeResponseDto = tradeService.getDeliveryInfoByProductId(productId);
        if (tradeResponseDto.isPresent()) {
            return ResponseEntity.ok(tradeResponseDto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    // 송장번호 입력
    @PutMapping("/delivery")
    public ResponseEntity<?> updateDelivery(@RequestBody TradeRequestDeliveryDTO tradeRequestDeliveryDTO) {
        boolean isUpdated = tradeService.updateDeliveryInfo(tradeRequestDeliveryDTO.getProductId(), tradeRequestDeliveryDTO.getInvoicenumber(), tradeRequestDeliveryDTO.getDeliverycompany());

        if (isUpdated) {
            return ResponseEntity.ok("Delivery information updated successfully.");
        } else {
            return ResponseEntity.badRequest().body("Failed to update delivery information.");
        }
    }
}
