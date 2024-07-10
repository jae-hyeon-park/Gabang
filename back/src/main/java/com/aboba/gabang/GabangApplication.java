package com.aboba.gabang;

//import com.aboba.gabang.batch.BatchJobStopper;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.launch.JobExecutionNotRunningException;
import org.springframework.batch.core.launch.NoSuchJobException;
import org.springframework.batch.core.launch.NoSuchJobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.scheduling.annotation.EnableScheduling;

//@EnableBatchProcessing
@SpringBootApplication
public class GabangApplication {
	@Autowired
//	static BatchJobStopper stopper;
	public static void main(String[] args) throws NoSuchJobException, NoSuchJobExecutionException, JobExecutionNotRunningException {
		SpringApplication.run(GabangApplication.class, args);

//		BatchJobStopper batchJobManager = context.getBean(BatchJobStopper.class);
//
//		// 실행 중인 배치 작업 조회
//		batchJobManager.listRunningJobs();
//
//		// 실행 중인 배치 작업 중지 (실행 중인 작업의 executionId를 전달해야 함)
//		long executionIdToStop = 1; // 중지할 실행 중인 작업의 executionId
//		batchJobManager.stopRunningJob(executionIdToStop);
	}
}
