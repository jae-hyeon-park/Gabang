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
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const VerificationForm = () => {
  const timelimit = 60;
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [verificationCodeError, setVerificationCodeError] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [timeLeft, setTimeLeft] = useState(timelimit);
  const [isClick, setClick] = useState(true);
  const [showModal, setShowModal] = useState(false); // 모달의 상태를 관리합니다.
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [isCancelButtion, setCancelButton] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    if (!isClick) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isClick]);

  useEffect(() => {
    if (timeLeft === 0) {
      clearInterval(timerRef.current);
    }
  }, [timeLeft]);

  const checkSuspension = async () => {
    try {
      const response = await fetch(`/api/users/check-suspension-phone/${phoneNumber}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('계정 정지 확인 오류:', error);
      return false;
    }
  };
  const checkPhoneNumberAvailability = async () => {
    try {
      const response = await fetch(`/api/users/check-phone-number/${phoneNumber}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('전화번호 중복 확인 오류:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isPhoneNumberAvailable = await checkPhoneNumberAvailability();
    const isSuspension = await checkSuspension();

    if (!phoneNumber) {
      setPhoneNumberError('전화번호를 입력하세요.');
      return;
    } else if (!isPhoneNumberAvailable) {
      alert('이미 사용 중인 전화번호입니다.');
      navigate('/signin');
      window.scrollTo(0, 0);
      return;
    } else if (isSuspension) {
      alert('현재 정지 중인 전화번호입니다.');
      navigate('/signin');
      window.scrollTo(0, 0);
    } else {
      setPhoneNumberError('');
    }

    if (!verificationCode) {
      setVerificationCodeError('인증번호를 입력하세요.');
      return;
    } else {
      setVerificationCodeError('');
    }

    if (isClick) {
      setIsValid(false);
      setVerificationCodeError('인증번호 전송을 눌러주세요');
      return;
    }
  };

  const certificateNum = async (e) => {
    e.preventDefault();

    const isPhoneNumberAvailable = await checkPhoneNumberAvailability();
    const isSuspension = await checkSuspension();

    if (!phoneNumber) {
      setPhoneNumberError('전화번호를 입력하세요.');
      return;
    } else if (!isPhoneNumberAvailable) {
      setMessage('이미 사용 중인 전화번호입니다.');
      setCancelButton(false);
      setShowModal(true);
      // alert('이미 사용 중인 전화번호입니다.');
      return;
    } else if (isSuspension) {
      setMessage('현재 정지 중인 전화번호입니다.');
      setCancelButton(false);
      setShowModal(true);
      // alert('현재 정지 중인 전화번호입니다.');
      return;
    }
    else{
      fetch('/api/sendCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      })
      // .then((response) => response.json())
      .then((data) => {
        setMessage('인증번호가 전송되었습니다.');
        setClick(false);
        setCancelButton(false);
        setShowModal(true);
        setTimeLeft(timelimit);
        setPhoneNumberError('');
        setVerificationCodeError('');
        timerRef.current = setInterval(() => {
          setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
    setVerificationCode('');
  };

  const verifyCode = () => {
    fetch('/api/verifyCode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, verificationCode }),
    })
      .then((response) => response.text())
      .then((data) => {
        if (data === '인증 성공') {
          setVerificationCodeError('');
          setMessage('인증 성공');
          setCancelButton(true);
          setShowModal(true);
        } else {
          setVerificationCodeError('인증번호가 올바르지 않습니다.');
          setMessage('인증 실패');
          setCancelButton(false);
          setShowModal(true);
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    setVerificationCode(inputValue);

    if (/^\d+$/.test(inputValue)) {
      setIsValid(true);
      setVerificationCodeError('');
    } else {
      setIsValid(false);
      setVerificationCodeError('인증번호는 6자리의 숫자입니다.');
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleNumberChange = (event) => {
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
    setVerificationCodeError('');
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleConfirmModal = () => {
    navigate('/signup/detail', { state: { phoneNumber } });
    window.scrollTo(0, 0);
  };

  return (
    <Box w="md" p={4} borderWidth="1px" borderRadius="lg">
      {/* <form onSubmit={handleSubmit}> */}
        <FormControl isInvalid={!isValid}>
          <FormLabel fontSize="3xl" fontWeight="bold">
            회원가입
          </FormLabel>
          <FormControl id="phone-number" isRequired isInvalid={!!phoneNumberError}>
            <FormLabel mt={8} fontSize="xl">
              전화번호
            </FormLabel>
            <Flex>
              <Input
                type="number"
                placeholder="-없이 숫자만 입력"
                value={phoneNumber}
                onChange={handleNumberChange}
                required
              />
              <Button
                isDisabled={phoneNumber.length < 11}
                w="20%"
                ml={2}
                onClick={certificateNum}
                bgColor="#3770FB"
                textColor="white"
                fontSize="lg"
                _hover={{
                  bgColor: '#3770FB',
                  textColor: 'white',
                }}>
                인증
              </Button>
            </Flex>
            <FormErrorMessage>{phoneNumberError}</FormErrorMessage>
          </FormControl>
          <FormControl id="verification-code" isRequired isInvalid={!!verificationCodeError}>
            <FormLabel mt={8} fontSize="xl">
              인증번호
            </FormLabel>
            <Flex align="center" mt={4}>
              <InputGroup>
                <Input
                  type="text"
                  placeholder=""
                  value={verificationCode}
                  onChange={handleChange}
                  isDisabled={timeLeft === 0}
                />
                {!isClick && (
                  <InputRightElement pointerEvents="none">
                    <Box color="red" textAlign="right" mr={8}>
                      {formatTime(timeLeft)}
                    </Box>
                  </InputRightElement>
                )}
              </InputGroup>
            </Flex>
            {timeLeft === 0 && (
              <Box color="red" textAlign="right">
                시간이 만료되었습니다. 인증번호를 다시 받아주세요.
              </Box>
            )}
            <FormErrorMessage>{verificationCodeError}</FormErrorMessage>
          </FormControl>
        </FormControl>

        <Button
          type="submit"
          bgColor="#3770FB"
          textColor="white"
          fontSize="xl"
          mt={8}
          w="100%"
          _hover={{
            bgColor: '#3770FB',
            textColor: 'white',
          }}
          onClick={() => verifyCode()}
          isDisabled={timeLeft === 0 || verificationCode.length < 6}>
          확인
        </Button>
      {/* </form> */}
      {/* 확인 모달 */}
      <ConfirmationModal
        isOpen={showModal}
        onConfirm={isCancelButtion === false ? closeModal : handleConfirmModal}
        onCancel={closeModal}
        message={message}
        isCancelButtion={false}
        isConfirmButton={true}
      />
    </Box>
  );
};

export default VerificationForm;
