// src/components/DetailForm.jsx
import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Button, FormErrorMessage, FormHelperText, Select, InputGroup, InputRightElement, Flex } from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import { useToast } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { validateAccount, validatePassword } from '../../utils/formValidation';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { getCookie, removeCookie } from '../../utils/cookie';

const Overlay = () => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      zIndex: 9999, 
    }}
  />
);

const UserInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, userName, userPhoneNumber, userAccount, cdBankcode } = location.state;
  const [account, setAccount] = useState(userAccount);
  const [accountError, setAccountError] = useState(false);
  const [bankcode, setBankcode] = useState(cdBankcode);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); // 모달 창 표시 여부 state 추가
  const [message, setMessage] = useState('');
  const [isWithdrawal, setIsWithdrawal] = useState(false);
  const toast = useToast();
  const [withdrawalInProgress, setWithdrawalInProgress] = useState(false);

  const handleNavigate2 = () => {
    navigate(-1);
  };
  
  const clickRepeatIcon = () => {
    setAccountError(false);
    setAccount(userAccount);
  }
  const handleChangeBank = (e) => {
    const inputBank = e.target.value;
    setBankcode(inputBank);
  };

  const handleChangeAccount = (e) => {
    if (isReadOnly === false) {
      let inputAccount = e.target.value;
      inputAccount = inputAccount.slice(0,14);
      setAccount(inputAccount);
      if (inputAccount.length < 11 || inputAccount.length > 14 || !validateAccount(inputAccount)) {
        setAccountError(true);
      } else {
        setAccountError(false);
      }
      
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = {};
    if (!bankcode) errors.bank = '은행을 선택하세요.';
    if (!account) errors.accountNumber = '계좌번호를 입력하세요.';
    if (accountError) errors.accountNumber = '계좌번호가 올바르지 않습니다.'
    if (account.length < 11 || account.length > 14 || !validateAccount(account)) {
      errors.accountNumber = '계좌번호는 숫자만 입력해주세요.';
    }

    if (Object.keys(errors).length === 0) {
      fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': getCookie('token') 
        },
        body: JSON.stringify({ "cdBankcode": bankcode, "userAccount": account })
      }).then(response => {
        if (response.ok) {
          // 변경이 완료되면 모달 창을 띄움
          setShowConfirmationModal(true);
          setIsWithdrawal(false);
          setMessage("변경이 완료되었습니다.");
        }
        else {
          // 응답이 성공적이지 않은 경우
          toast({
            title: '오류 발생',
            description: '회원정보 변경에 실패했습니다.',
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  };

  const handleConfirmationModalClose = () => {
    // 모달 창 닫기 버튼을 누르면 홈페이지로 이동
    setShowConfirmationModal(false);
    navigate(`/my/${userId}`);
    window.scrollTo(0, 0);
  };

  const handleNavigate = () => {
    navigate(`/my/update/pw`, {
      state: {
        userId: userId
      }
    }), window.scrollTo(0, 0);
  };

  const handleWithdrawal = () => {
    setIsWithdrawal(true);
    setShowConfirmationModal(true);
    setMessage("탈퇴하시겠습니까?");
  };

  const handleWithdrawalConfirmation = async () => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getCookie('token')
        },
      });

      if (response.ok) {
        toast({
          title: '성공',
          description: '성공적으로 탈퇴처리 되었습니다.',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
        setWithdrawalInProgress(true);
        setShowConfirmationModal(false);
        setTimeout(() => {
          navigate("/");
          removeCookie("token");
        }, 1300);
      } else {
        // 응답이 성공적이지 않은 경우
        toast({
          title: '오류 발생',
          description: '회원탈퇴에 실패했습니다.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      // 네트워크 오류 등의 예외 발생 시
      toast({
        title: '오류 발생',
        description: '회원탈퇴 중 오류가 발생했습니다.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box w="md" p={4} borderWidth="1px" borderRadius="lg" mt={16}>
      {withdrawalInProgress && <Overlay />}
      <form onSubmit={handleSubmit}>
        <FormLabel textAlign="left" fontSize="3xl" fontWeight="bold">내 정보</FormLabel>
        <FormControl mt={8}>
          <FormLabel fontSize="xl" mt={8}>아이디</FormLabel>
          <InputGroup>
            <Input
              type="text"
              name="username"
              value={userId}
              readOnly={true}
              isDisabled={true}
            />
          </InputGroup>
        </FormControl>
        <FormControl mt={8}>
          <FormLabel fontSize="xl">비밀번호</FormLabel>
          <Button h='1.75rem' size='sm' onClick={() => handleNavigate()}>변경</Button>
        </FormControl>
        <FormControl mt={8}>
          <FormLabel fontSize="xl">전화번호</FormLabel>
          <Input
            type="number"
            name="phoneNumber"
            value={userPhoneNumber}
            readOnly={true}
            isDisabled={true}
          />
        </FormControl>
        <FormControl mt={8}>
          <FormLabel fontSize="xl">은행</FormLabel>
          <Select
            name="bank"
            value={bankcode}
            onChange={handleChangeBank}
          >
            <option value="01">우리은행</option>
            <option value="02">국민은행</option>
            <option value="03">토스뱅크</option>
          </Select>
        </FormControl>
        <FormControl isInvalid={accountError} mt={8}>
          <FormLabel fontSize="xl">계좌번호</FormLabel>
          <InputGroup size='md'>
            <Input
              type="number"
              name="accountNumber"
              value={account}
              onChange={handleChangeAccount}
              placeholder="계좌번호를 입력하세요."
              readOnly={isReadOnly}
              isDisabled={isReadOnly}
            />
            <InputRightElement width='4.5rem'>
              {isReadOnly ? <Button h='1.75rem' size='sm' onClick={() => setIsReadOnly(!isReadOnly)}>변경</Button>
                          : <RepeatIcon h='1.75rem' size='sm' onClick={() => clickRepeatIcon()}></RepeatIcon>
              }
            </InputRightElement>
          </InputGroup>
          {accountError && <FormErrorMessage>계좌번호는 11~14자리의 숫자만 입력해주세요.</FormErrorMessage>}
        </FormControl>
        <Button
          type="button"
          variant="link" // 배경 없이 스타일을 link로 설정
          fontSize="sm" // 작은 글씨 크기
          color="gray" // 검정 글자색
          textDecoration="underline" // 밑줄
          mt={8} // 상단 간격 조정
          onClick={() => handleWithdrawal()}
        >
          회원 탈퇴
        </Button>
        <Flex>
          <Button
            type="submit"
            bgColor="#3770FB"
            textColor="white"
            fontSize="xl"
            mt={3} mr="1%"
            w="100%"
            _hover={{ bgColor: '#3770FB', textColor: 'white' }}
            onClick={handleSubmit}
          >
            확인
          </Button>
          <Button variant="unstyled" bgColor="color.gray_1" textColor="white" fontSize="xl" w="full" ml="1%" mt={3} onClick={() => handleNavigate2()}>
            취소
          </Button>
        </Flex>
      </form>
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onConfirm={isWithdrawal? handleWithdrawalConfirmation : handleConfirmationModalClose}
        onCancel={() => setShowConfirmationModal(false)}
        message={message}
        isConfirmButton={true}
        isCancelButtion={isWithdrawal}
      />
    </Box>
  );
};

export default UserInfo;
