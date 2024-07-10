package com.aboba.gabang.trade.service;
import com.aboba.gabang.account.service.AccountService;
import com.aboba.gabang.product.model.Product;
import com.aboba.gabang.product.repository.ProductRepository;
import com.aboba.gabang.trade.dto.TradeDTO;
import com.aboba.gabang.trade.model.Trade;
import com.aboba.gabang.trade.repository.TradeRepository;
import com.aboba.gabang.user.model.User;
import com.aboba.gabang.user.repository.UserRepository;
import org.junit.jupiter.api.Test;

import org.mockito.Mock;
import org.mockito.InjectMocks;

import org.springframework.boot.test.context.SpringBootTest;


import java.util.Optional;
import java.util.concurrent.*;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class TradeServiceTest {
    @Mock
    private TradeRepository tradeRepository;
    @Mock
    private ProductRepository productRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private AccountService accountService;

    @InjectMocks
    private TradeService tradeService;

    private final ExecutorService executorService = Executors.newFixedThreadPool(7);



    @Test
    public void createTrade_concurrencyTest() throws InterruptedException, ExecutionException {
        int numberOfTasks = 7;
        Future<String>[] results = new Future[numberOfTasks];


        Product mockProduct = new Product();
        mockProduct.setProductId(21);
        mockProduct.setTradeState("1");
        mockProduct.setProductPrice(1000);
        when(productRepository.findProductForUpdate(anyInt())).thenReturn(Optional.of(mockProduct));

        User mockUser = new User();
        mockUser.setUserId("user01");
        when(userRepository.findById(anyString())).thenReturn(Optional.of(mockUser));

        when(accountService.checkAccount(anyInt(), any())).thenReturn("결제완료");

        when(tradeRepository.save(any(Trade.class))).thenAnswer(invocation -> {
            mockProduct.setTradeState("2");
            return null; // 혹은 적절한 Trade 객체를 반환하도록 설정
        });


        for (int i = 0; i < numberOfTasks; i++) {

            results[i] = executorService.submit(() -> {
                TradeDTO tradeDTO = new TradeDTO("Test Destination", "user01", "Cash", 1000, "Direct", 21);
                return tradeService.createTrade(tradeDTO);
            });
        }

        executorService.shutdown();
        assertTrue(executorService.awaitTermination(1, TimeUnit.MINUTES), "Tasks did not finish in time");

        int successCount = 0;
        for (Future<String> result : results) {
            if ("거래완료".equals(result.get())) {
                successCount++;
            }
        }

        assertEquals(1, successCount, "More than one trade was successful, which indicates a concurrency issue");
    }
}
