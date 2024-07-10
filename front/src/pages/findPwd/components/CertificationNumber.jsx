import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  Text,
  InputRightElement,
  InputGroup,
  useToast,
} from '@chakra-ui/react';

const CertificationNumber = ({
  verificationCode,
  setVerificationCode,
  phoneNumber,
  setPhoneNumber,
  isClick,
  setClick,
  onVerificationExpired,
  setVerify,
  setShowToast,
}) => {
  const [isValid, setIsValid] = useState(true); //전화번호
  const [errorMessage, setErrorMessage] = useState('');

  const timelimit = 180;

  const [isValid2, setIsValid2] = useState(true); // 인증번호의 유효성 여부를 추적하는 상태
  const [errorMessage2, setErrorMessage2] = useState(''); // 오류 메시지
  const [timeLeft, setTimeLeft] = useState(timelimit); // 3분 카운트다운
  const timerRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    // 초기화 시 타이머 설정
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // 시간이 0이 되면 타이머 정리
    if (timeLeft === 0) {
      clearInterval(timerRef.current);
      onVerificationExpired(true);
    }
  }, [timeLeft, onVerificationExpired]);

  const handleNumberChange = (event) => {
    //전화번호 입력시
    let value = event.target.value;
    value = value.replace(/\D/g, '');
    if (value.length > 11) {
      value = value.slice(0, 11);
    }
    setPhoneNumber(value);
    clearInterval(timerRef.current);
    setTimeLeft(timelimit);
    setClick(true);

    setVerificationCode('');
    setIsValid(true);
  };

  // const certificateNum = (e) => {
  //   //인증번호 전송 클릭시
  //   setClick(false);
  //   setErrorMessage('');
  //   handleResend();
  // };

  const certificateNum = (e) => {
    e.preventDefault();
    setClick(false);
    setErrorMessage('');
    handleResend();

    fetch('/api/sendCode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage('인증번호가 전송되었습니다.');
        setCancelButton(false);
        setShowModal(true);
        setTimeLeft(timelimit);
        timerRef.current = setInterval(() => {
          setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    setVerificationCode('');
  };

  const verifyCode = async () => {
    try {
      const response = await fetch('/api/verifyCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, verificationCode }),
      });
      const data = await response.text();
      if (response.ok && data === '인증 성공') {
        setVerify(true);
        setShowToast(true);
      } else {
        setVerify(false);
        setShowToast(true);
      }
    } catch (error) {
      toast({
        title: '오류 발생',
        description: '전화번호 인증에 실패했습니다.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    setVerificationCode(inputValue);

    if (/^\d+$/.test(inputValue)) {
      setIsValid2(true);
      setErrorMessage2('');
    } else {
      setIsValid2(false);
      setErrorMessage2('인증번호는 3자리의 숫자입니다.');
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleResend = () => {
    // 타이머 초기화
    clearInterval(timerRef.current);

    // 새로운 타이머 시작
    setTimeLeft(timelimit);
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    // 입력 칸 초기화
    setVerificationCode('');
    setIsValid2(true);
  };

  return (
    <>
      <FormControl mt={8} id="phone-number" isRequired isInvalid={!isValid}>
        <FormLabel fontSize="xl">전화번호</FormLabel>

        <Flex>
          <Input
            type="number"
            placeholder="-없이 입력해주세요"
            value={phoneNumber}
            onChange={handleNumberChange}
            // isDisabled={!isClick}
            required
          />
          <Button
            isDisabled={phoneNumber.length < 11}
            w="20%"
            variant="unstyled"
            bgColor="#365BFF"
            textColor="white"
            ml={3}
            onClick={certificateNum}
            _hover={{ bg: '#365BFF' }}>
            인증
          </Button>
        </Flex>
        <FormErrorMessage>{errorMessage}</FormErrorMessage>
      </FormControl>

      <FormControl mt={8} isRequired isInvalid={!isValid2}>
        <FormLabel fontSize="xl">인증번호를 입력해주세요.</FormLabel>
        <Flex align="center" mt={4}>
          <InputGroup>
            <Input
              type="text"
              placeholder=""
              value={verificationCode}
              onChange={handleChange}
              disabled={timeLeft === 0 || isClick} // 시간 만료되었을 때 입력 폼 비활성화
            />

            {isClick ? null : ( // 타이머 숨김/노출 로직
              <InputRightElement pointerEvents="none">
                <Box color="red" textAlign="right" mr={8}>
                  {formatTime(timeLeft)}
                </Box>
              </InputRightElement>
            )}
          </InputGroup>
        </Flex>
        {timeLeft === 0 && !isClick && (
          <Box color="red" textAlign="right">
            시간이 만료되었습니다. 인증번호를 다시 받아주세요.
          </Box>
        )}
      </FormControl>

      <Button
        fontSize="xl"
        mt={8}
        variant="unstyled"
        bgColor="color.blue"
        textColor="white"
        w="full"
        type="submit"
        _hover={{
          bgColor: 'color.blue',
          textColor: 'white',
        }}
        onClick={verifyCode}
        disabled={isClick || !verificationCode}>
        확인
      </Button>
    </>
  );
};

export default CertificationNumber;
