import React, { useState } from 'react';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { Box, FormControl, FormLabel, Radio, RadioGroup, Input, Button, ButtonGroup, Stack, Text, Divider, Checkbox, Image, Flex } from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCookie, getPayload } from '../../../utils/cookie';

const PaymentPage = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const { productId, imageUrl, productName, pPrice } = location.state; //넘겨온 값 쓸 곳

  const [postalCode, setPostalCode] = useState(''); //우편번호
  const [selectedAddress, setSelectedAddress] = useState(''); //배송지
  const [detailAddress, setDetailAddress] = useState(''); //상세주소
  
  const [deliveryMethod, setDeliveryMethod] = useState(''); //거래방식
  const [paymentMethod, setPaymentMethod] = useState(''); //결제수단
  const [productPrice, setProductPrice] = useState(pPrice); // 상품 가격 예시
  const [checkedItems, setCheckedItems] = useState([false, false, false]);

  const allChecked = checkedItems.every(Boolean);
  const isIndeterminate = checkedItems.some(Boolean) && !allChecked;

  const openDaumPostcode = useDaumPostcodePopup();

  // 우편번호 모달 열기
  const handleOpenModal = () => {
    openDaumPostcode({
      onComplete: (data) => {
        setPostalCode(data.zonecode);
        setSelectedAddress(data.address);
      }
    });
  };

  const handleDeliveryMethodChange = (value) => {
    setPostalCode('');
    setSelectedAddress('');
    setDetailAddress('');
    setDeliveryMethod(value);
  };

  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);
  };

  const handlePayment = async (e) => {
    e.preventDefault(); // 폼 제출 기본 이벤트 방지
    // 유효성 검사
    if (!deliveryMethod) {
      alert('거래 방식을 선택해주세요.');
      return;
    }
    if (deliveryMethod === 'T' && (!postalCode || !selectedAddress || !detailAddress)) {
      alert('배송지 정보(상세주소 포함)를 입력해주세요.');
      return;
    }
    if (!paymentMethod) {
      alert('결제 수단을 선택해주세요.');
      return;
    }
    if (!allChecked) {
      alert('모든 필수 동의사항에 동의해주세요.');
      return;
    }

    // 결제 처리 로직
    let destination = "";
    if(deliveryMethod=="T"){
     destination = postalCode + "/" + selectedAddress + "/" + detailAddress; //전체 배송지 주소
    }

    const user = getPayload("token").userId;

    const tradeData = {
      destination,
      buyerId: user, //나중에 받아온 값으로 변경
      cdPaymentMethod: paymentMethod,
      payment: productPrice,
      transactionMethod: deliveryMethod,
      productId 

    }

  try{
    const submitResponse = await fetch('/api/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getCookie('token')
      },
      body: JSON.stringify(tradeData),
    });

    if (submitResponse.ok) {

      const result = await submitResponse.json(); // 여기에서 result에 응답의 JSON 데이터가 담기게 됩니다.
      
      // 결과에 따라 다른 동작을 할 수 있습니다.
      if(result.message === "거래완료") {
        alert("결제가 성공적으로 처리되었습니다.");
        navigate('/');
        return;
      } else if(result.message === "잔액부족"){
        alert("잔액이 부족합니다.");
        return;
      } else {
        alert("결제 처리에 실패했습니다.");
        return;
      }
    } else {
      // 제출 실패 시
      alert("제출 실패");
      return;
    }
    } catch (error) {
    console.error('Error during image upload:', error);
    }
    };


  const safeCharge = Math.round(productPrice * 0.05);
  const totalPayment = productPrice + safeCharge;

  return (
    <Box as='form' onSubmit={handlePayment} w="md" mt={10} p={4} borderWidth="1px" borderRadius="lg">
      <FormLabel fontSize="3xl" fontWeight="bold">결제하기</FormLabel>
      <FormControl id="orderInfo">
        <FormLabel fontSize="xl" mt={8} fontWeight="bold">상품정보</FormLabel>
          <Flex align="center" mb={4} ml={1} mr={1}>
            <Image src={imageUrl} alt="Product Image" rounded="md" w={70} h={70} mr={2} />
            <Box>
              <Text mb={2} fontWeight="bold">{productName}</Text>
              <Text fontSize="sm" fontWeight="bold">{productPrice}원</Text>
            </Box>
          </Flex>
      </FormControl>
      <FormControl id="deliveryMethod" isRequired>
        <FormLabel fontSize="xl" mt={8} fontWeight="bold">거래 방식</FormLabel>
        <RadioGroup onChange={(e) => handleDeliveryMethodChange(e)}>
          <Stack spacing={4} direction='row'>
            <Radio value="G">직거래</Radio>
            <Radio value="T">택배</Radio>
          </Stack>
        </RadioGroup>
      </FormControl>
      {deliveryMethod === 'T' && (
        <FormControl id="address" isRequired mt={4}>
          <FormLabel fontSize="xl" mt={8} fontWeight="bold">배송지</FormLabel>
          <Stack direction="row" justify="space-between" alignItems="center" mb={2}>
            <Button onClick={handleOpenModal}><Search2Icon/></Button>
            <Input type="text" value={postalCode} readOnly placeholder="우편번호" />
          </Stack>
          <Input type="text" value={selectedAddress} readOnly placeholder="주소" mb={2}/>
          <Input type="text" value={detailAddress} onChange={(e) => setDetailAddress(e.target.value)} placeholder="상세주소" />
        </FormControl>
      )}
      <FormControl id="paymentMethod" isRequired mt={4}>
        <FormLabel fontSize="xl" mt={8} fontWeight="bold">결제 수단</FormLabel>
        <Stack spacing={4}>
        <ButtonGroup>
          <Button
            bgColor='white'
            textColor='black'
            borderColor="gray"
            borderWidth="1px"
            _hover={{
              bgColor: '#3770FB',
              textColor: 'white',
            }}
            _active={{
              bgColor: '#3770FB',
              textColor: 'white',
            }}
            onClick={() => handlePaymentMethodChange("01")}
            isActive={paymentMethod === "01"}
            size="md"
            w="100%"
          >
            카카오페이
          </Button>
          {/* 다른 버튼들도 같은 방식으로 스타일 및 이벤트 핸들러를 적용 */}
          <Button
            bgColor='white'
            textColor='black'
            borderColor="gray"
            borderWidth="1px"
            _hover={{
              bgColor: '#3770FB',
              textColor: 'white',
            }}
            _active={{
              bgColor: '#3770FB',
              textColor: 'white',
            }}
            onClick={() => handlePaymentMethodChange("02")}
            isActive={paymentMethod === "02"}
            size="md"
            w="100%"
          >
            토스페이
          </Button>
          <Button
            bgColor='white'
            textColor='black'
            borderColor="gray"
            borderWidth="1px"
            _hover={{
              bgColor: '#3770FB',
              textColor: 'white',
            }}
            _active={{
              bgColor: '#3770FB',
              textColor: 'white',
            }}
            onClick={() => handlePaymentMethodChange("03")}
            isActive={paymentMethod === "03"}
            size="md"
            w="100%"
          >
            무통장
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button
            bgColor='white'
            textColor='black'
            borderColor="gray"
            borderWidth="1px"
            _hover={{
              bgColor: '#3770FB',
              textColor: 'white',
            }}
            _active={{
              bgColor: '#3770FB',
              textColor: 'white',
            }}
            onClick={() => handlePaymentMethodChange("04")}
            isActive={paymentMethod === "04"}
            size="md"
            w="100%"
          >
            휴대폰결제
          </Button>
          <Button
            bgColor='white'
            textColor='black'
            borderColor="gray"
            borderWidth="1px"
            _hover={{
              bgColor: '#3770FB',
              textColor: 'white',
            }}
            _active={{
              bgColor: '#3770FB',
              textColor: 'white',
            }}
            onClick={() => handlePaymentMethodChange("05")}
            isActive={paymentMethod === "05"}
            size="md"
            w="100%"
          >
            네이버페이
          </Button>
          <Button
            bgColor='white'
            textColor='black'
            borderColor="gray"
            borderWidth="1px"
            _hover={{
              bgColor: '#3770FB',
              textColor: 'white',
            }}
            _active={{
              bgColor: '#3770FB',
              textColor: 'white',
            }}
            onClick={() => handlePaymentMethodChange("06")}
            isActive={paymentMethod === "06"}
            size="md"
            w="100%"
          >
            페이코
          </Button>
        </ButtonGroup>
        </Stack>
      </FormControl>
      <FormControl id="paymentAmount" mt={4}>
        <FormLabel fontSize="xl" mt={8} fontWeight="bold">결제금액</FormLabel>
        <Box p={4} borderWidth="1px" borderRadius="lg">
          <Stack direction="row" justify="space-between" alignItems="center" mb={2}>
            <Text flex={1}>상품금액</Text>
            <Text textAlign="right">{productPrice.toLocaleString()}원</Text>
          </Stack>
          <Stack direction="row" justify="space-between" alignItems="center" mb={2}>
            <Text flex={1}>안전 결제 수수료</Text>
            <Text textAlign="right">+ {safeCharge.toLocaleString()}원</Text>
          </Stack>
          <Divider mt={4}/>
          <Stack direction="row" justify="space-between" alignItems="center" mb={2} mt={4}>
            <Text flex={1} fontWeight="bold">총 결제금액</Text>
            <Text textAlign="right" fontWeight="bold">{totalPayment.toLocaleString()}원</Text>
          </Stack>
        </Box>
      </FormControl>
      <FormControl id="paymentAgree" isRequired mt={8}>
      <Checkbox
        isChecked={allChecked}
        isIndeterminate={isIndeterminate}
        onChange={(e) => setCheckedItems([e.target.checked, e.target.checked, e.target.checked])}
      >
        아래 내용에 전체 동의해요.
      </Checkbox>
      <Stack pl={6} mt={1} spacing={1}>
        <Checkbox
          isChecked={checkedItems[0]}
          onChange={(e) => setCheckedItems([e.target.checked, checkedItems[1], checkedItems[2]])}
        >
          가방 서비스 이용약관 동의 (필수)
        </Checkbox>
        <Checkbox
          isChecked={checkedItems[1]}
          onChange={(e) => setCheckedItems([checkedItems[0], e.target.checked, checkedItems[2]])}
        >
          개인정보 수집 및 이용 동의 (필수)
        </Checkbox>
        <Checkbox
          isChecked={checkedItems[2]}
          onChange={(e) => setCheckedItems([checkedItems[0], checkedItems[1], e.target.checked])}
        >
          가방 서비스 이용약관 동의 (필수)
        </Checkbox>
        <Checkbox
          isChecked={checkedItems[2]}
          onChange={(e) => setCheckedItems([checkedItems[0], checkedItems[1], e.target.checked])}
        >
          결제 7일 후 자동 구매확정 동의 (필수)
        </Checkbox>
      </Stack>

      
      </FormControl>
      <Button type='submit' bgColor="#3770FB" textColor="white" fontSize="xl" mt={8} mb={4} w="100%" _hover={{
                bgColor: '#3770FB',
                textColor: 'white',
              }}>
        결제하기
      </Button>
    </Box>
  );
};

export default PaymentPage;
