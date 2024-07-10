package com.aboba.gabang.batch;

import com.aboba.gabang.account.service.AccountService;
import com.aboba.gabang.product.service.ProductService;
import com.aboba.gabang.trade.model.Trade;
import com.aboba.gabang.trade.service.TradeService;
import lombok.RequiredArgsConstructor;
import org.springframework.batch.item.ItemProcessor;

import java.time.LocalDate;
import java.time.ZoneId;

@RequiredArgsConstructor
public class CustomProcessor implements ItemProcessor<Trade, Trade> {

    private final TradeService tradeService;
    private final AccountService accountService;
    private final ProductService productService;

    @Override
    public Trade process(Trade trade) throws Exception {
        if (trade.getTransactionCompletionTime() == null) {
            // 계좌 처리
            accountService.deposit(trade.getProduct().getProductId());
            // 거래 데이터에 구매확정일 업데이트
            tradeService.updateTrade(trade.getTradeId());
            // 판매 상태 변경(판매 완료)
            productService.updateState(trade.getProduct().getProductId(), "3");
        }
        return trade;
    }
}
