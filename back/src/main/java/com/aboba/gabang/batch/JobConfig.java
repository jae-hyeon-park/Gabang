package com.aboba.gabang.batch;

import com.aboba.gabang.account.service.AccountService;
import com.aboba.gabang.product.service.ProductService;
import com.aboba.gabang.trade.model.Trade;
import com.aboba.gabang.trade.service.TradeService;
import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.launch.JobExecutionNotRunningException;
import org.springframework.batch.core.launch.JobOperator;
import org.springframework.batch.core.launch.NoSuchJobExecutionException;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.repository.JobRestartException;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
@RequiredArgsConstructor
public class JobConfig {

    private final TradeService tradeService;
    private final AccountService accountService;
    private final ProductService productService;

    @Bean
    public Job completeTradeJob(JobRepository jobRepository, PlatformTransactionManager transactionManager) {
        return new JobBuilder("job", jobRepository)
                .flow(simpleStep(jobRepository, transactionManager))
                .end()
                .build();
    }

    @Bean
    public Step simpleStep(JobRepository jobRepository, PlatformTransactionManager transactionManager) {
        return new StepBuilder("step", jobRepository)
                .<Trade, Trade>chunk(100, transactionManager)
                .allowStartIfComplete(true)
                .reader(new CustomReader(tradeService))
                .processor(new CustomProcessor(tradeService, accountService, productService))
                .writer(new CustomWriter())
                .build();
    }
}
