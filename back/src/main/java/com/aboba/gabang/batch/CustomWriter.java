package com.aboba.gabang.batch;

import com.aboba.gabang.product.aspect.ProductLoggingAspect;
import com.aboba.gabang.trade.model.Trade;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;

import java.time.format.DateTimeFormatter;

public class CustomWriter implements ItemWriter<Trade> {

    private static final Logger logger = LoggerFactory.getLogger(ProductLoggingAspect.class);

    @Override
    public void write(Chunk<? extends Trade> chunk) throws Exception {
        for (Trade trade : chunk) {
            logger.info("CustomWriter - tradeId : {}, buyer : {}, transactionCompletionTime : {}", trade.getTradeId(), trade.getBuyer(), trade.getTransactionCompletionTime());
        }
    }
}
