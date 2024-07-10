package com.aboba.gabang.batch;

import com.aboba.gabang.trade.model.Trade;
import com.aboba.gabang.trade.service.TradeService;
import lombok.RequiredArgsConstructor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.NonTransientResourceException;
import org.springframework.batch.item.ParseException;
import org.springframework.batch.item.UnexpectedInputException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;

@RequiredArgsConstructor
public class CustomReader implements ItemReader<Trade> {

    private int index = 0;
    private final LocalDate now = LocalDate.now(ZoneId.of("Asia/Seoul"));
    private final LocalDate sevenDaysAgo = now.minusDays(7);

    private final TradeService tradeService;
    private List<Trade> trades;

    @Override
    public Trade read() throws Exception, UnexpectedInputException, ParseException, NonTransientResourceException {
        if (trades == null) {
            LocalDateTime startOfDay = LocalDateTime.of(sevenDaysAgo, LocalTime.MIN);
            LocalDateTime endOfDay = LocalDateTime.of(sevenDaysAgo, LocalTime.MAX);

            trades = tradeService.findByTradeCompletionTimeBetween(
                    startOfDay.atZone(ZoneId.of("Asia/Seoul")).toLocalDateTime(),
                    endOfDay.atZone(ZoneId.of("Asia/Seoul")).toLocalDateTime());
        }
        if (index >= trades.size()) {
            return null;
        }
        return trades.get(index++);
    }
}