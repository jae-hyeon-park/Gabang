package com.aboba.gabang.trade.service;

import com.aboba.gabang.account.service.AccountService;
import com.aboba.gabang.chat.model.ChatRoom;
import com.aboba.gabang.chat.service.ChatMessageService;
import com.aboba.gabang.chat.service.ChatRoomService;
import com.aboba.gabang.chat.service.ChatService;
import com.aboba.gabang.product.model.Product;
import com.aboba.gabang.product.repository.ProductRepository;
import com.aboba.gabang.product.service.ProductService;
import com.aboba.gabang.trade.dto.TradeDTO;
import com.aboba.gabang.trade.dto.TradeRequestDeleteDto;
import com.aboba.gabang.trade.dto.TradeResponseDto;
import com.aboba.gabang.trade.model.Trade;
import com.aboba.gabang.trade.repository.TradeRepository;
import com.aboba.gabang.user.model.User;
import com.aboba.gabang.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TradeService {
    private final TradeRepository tradeRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final AccountService accountService;
    private final ProductService productService;
    private final ChatService chatService;
    private final ChatMessageService chatMessageService;

    public Page<TradeResponseDto> findByBuyerId(String userId, String searchKeyword, String state, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);

        // 검색어 있으면
        if (searchKeyword != null && !searchKeyword.equals("null") && !searchKeyword.equals("undefined")) {
            return tradeRepository.findProductByProductNameContaining(userId, searchKeyword, pageRequest);
        }

        // 검색어 없으면 상태에 따라 구매확정 전, 후
        if (state.equals("all") || state.equals("null") || state.equals("undefined")) {
            return tradeRepository.findProductByBuyerId(userId, pageRequest);
        } else if (state.equals("before")) {
            return tradeRepository.findProductByBuyerIdWithNullTransactionCompletionTime(userId, pageRequest);
        } else {
            return tradeRepository.findProductByBuyerIdWithNOTNullTransactionCompletionTime(userId, pageRequest);
        }
    }

    public Trade findById(Integer tradeId) {
        return tradeRepository.findById(tradeId)
                .orElseThrow(() -> new IllegalArgumentException("tradeId not found: " + tradeId));
    }

    public List<Trade> findByTradeCompletionTimeBetween(LocalDateTime sevenDaysAgo, LocalDateTime now) {
        return tradeRepository.findByTradeCompletionTimeBetween(sevenDaysAgo, now);
    }

    @Transactional
    public void updateTrade(int id) {
        LocalDateTime completionTime = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
        Trade trade = tradeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("not found: " + id));
        trade.update(completionTime);
    }

    @Transactional(timeout = 30) //타임아웃 60초로 설정
    public synchronized  String createTrade (TradeDTO tradeDTO){
        Optional<Product> productOpt = productRepository.findProductForUpdate(tradeDTO.getProductId());

        if (productOpt.isEmpty()) {
            return "해당하는 Product 조회 안됨";
        }

        Product product = productOpt.get();

        // 거래 가능한 상태인지 체크
        if (!"1".equals(product.getTradeState())) {
            System.out.println("거래 이미 진행중");
            return "이미 거래가 진행중이거나 완료되었습니다.";
        }

        // 유저 조회
        Optional<User> userOpt = userRepository.findById(tradeDTO.getBuyerId());
        if (userOpt.isEmpty()) {
            return "해당하는 user가 조회 안됨";
        }
        // 계좌에서 해당 비용만큼 확인 및 차감
        String result = accountService.checkAccount((int)Math.round(product.getProductPrice() * 1.05), userOpt.get());

        if(result.equals("결제완료")){
        // 거래 생성
        Trade trade = tradeDTO.toEntity(userOpt.get(), product);
        tradeRepository.save(trade);

        // 상품 상태 업데이트
        product.setTradeState("2"); // 예약중 상태로 변경
        productRepository.save(product);


        // 판매 수락, 거절 결정
        ChatRoom chatRoom = chatService.findOrCreateChatRoom(product.getProductId(), tradeDTO.getBuyerId(), product.getSeller().getUserId());
        chatMessageService.sendDecisionRequestMessage(
                    "해당 상품에 대한 결제가 완료되었습니다. 판매 수락 여부를 결정해주세요.",
                    userOpt.orElseThrow(),
                    chatRoom
        );

        return "거래완료";
        }
        else{
            if(result.equals("잔액부족")){
                return "잔액부족";
            } else if (result.equals("해당 계좌없음")) {
                return "해당 계좌없음";
            }else {
                return "그 외 문제발생";
            }
        }

    }

//    // 판매 거절
//    public void deleteTrade(TradeRequestDeleteDto dto) {
//        Trade trade = tradeRepository.findTradeByProductId(dto.getProductId());
//
//        // 환불
//        User buyer = userRepository.findByUserIdAndYnSecession(dto.getBuyerId(), false);
//        String cdBankcode = buyer.getCdBankcode();
//        String userAccount = buyer.getUserAccount();
//        accountService.deposit(cdBankcode, userAccount, trade.getPayment());
//
//        // 판매중으로 변경
//        productService.updateState(dto.getProductId(), "1");
//
//        // trade 데이터 삭제
//        tradeRepository.deleteById(trade.getTradeId());
//
//        // 판매자&구매자에게 알림 전송
//
//    }

    @Transactional
    // 판매 거절
    public void deleteTrade(Integer productId) {
        Product product = productRepository.findById(productId).get();
        User seller = product.getSeller();

        Trade trade = tradeRepository.findTradeByProductId(productId);
        User buyer = trade.getBuyer();
        String buyerId = buyer.getUserId();

        // 환불
//        User buyer = userRepository.findByUserIdAndYnSecession(buyerId, false);
        String cdBankcode = buyer.getCdBankcode();
        String userAccount = buyer.getUserAccount();
        accountService.deposit(cdBankcode, userAccount, trade.getPayment());

        // 판매중으로 변경
        productService.updateState(productId, "1");

        // trade 데이터 삭제
        Integer tradeId = trade.getTradeId();
        System.out.println(tradeId);
        tradeRepository.deleteByTradeId(tradeId);


        // 판매자&구매자에게 알림 전송

    }

    public Optional<TradeResponseDto> getDeliveryInfoByProductId(Integer productId) {
        return productRepository.findById(productId)
                .map(product -> new TradeResponseDto(product, product.getTrade().getTransactionCompletionTime()));
    }

    @Transactional
    public boolean updateDeliveryInfo(Integer productId, String invoicenumber, String deliverycompany) {
        return productRepository.findById(productId)
            .flatMap(tradeRepository::findByProduct)  // Product 객체를 TradeRepository의 findByProduct 메소드에 전달
            .map(trade -> {
                trade.setInvoicenumber(invoicenumber);
                trade.setDeliverycompany(deliverycompany);
                tradeRepository.save(trade);
                return true;
            })
            .orElse(false);
    }
}
