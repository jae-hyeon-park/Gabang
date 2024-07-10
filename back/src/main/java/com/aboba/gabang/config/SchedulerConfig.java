package com.aboba.gabang.config;

import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.*;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Transactional;

@Configuration
@RequiredArgsConstructor
public class SchedulerConfig {

    private final JobLauncher jobLauncher;
    private final Job completeTradeJob;

    // 초 분 시 일 월 요일
    @Scheduled(cron = "0 0 10 * * ?") // 매일 오전 10시에 실행
    @Transactional
    public void launchCompleteTradeJob() throws JobExecutionException {
        JobParameters jobParameters = new JobParametersBuilder()
                .addLong("time", System.currentTimeMillis())
                .toJobParameters();
        jobLauncher.run(completeTradeJob, jobParameters);
    }
}