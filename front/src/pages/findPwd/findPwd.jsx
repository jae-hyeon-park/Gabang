import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Flex,
  Heading,
  useToast,
  Select,
  FormErrorMessage,
} from '@chakra-ui/react';
import IdForm from './components/IdForm';
import NameForm from './components/NameForm';
import CertificationNumber from './components/CertificationNumber';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCookie } from '../../utils/cookie';

function findPwd() {
  const location = useLocation();
  const [phoneNumber, setPhoneNumber] = React.useState('');

  const [name, setName] = React.useState('');
  const [nameError, setNameError] = React.useState(false);

  const [user_id, setUser_Id] = React.useState(location.state ? location.state.userId : '');
  const [userIdError, setUserIdError] = React.useState(false);

  const [isClick, setClick] = React.useState(true);

  const [verificationCode, setVerificationCode] = useState('');
  const [verificationExpired, setVerificationExpired] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const [verify, setVerify] = useState(false);
  const setVerfiy = (verify) => {
    setVerify(verify);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (userIdError || nameError) {
      alert('아이디나 이름을 정해진 규칙대로 입력해주세요');
      return;
    }

    if (isClick) {
      alert('인증번호 전송을 눌러주세요');
      return;
    }
  };

  useEffect(() => {
    if (verify) {
      const submitData = async () => {
        try {
          const response = await fetch('/api/users/find-pw', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: getCookie('token'),
            },
            body: JSON.stringify({ userName: name, userPhoneNumber: phoneNumber, userId: user_id }),
          });
          const data = await response.json();
          if (response.ok) {
            if(data){
              toast({
                title: '성공',
                description: data.message || '인증에 성공하였습니다.',
                status: 'success',
                duration: 9000,
                isClosable: true,
              });
              navigate('/help/pw2', { state: { user_id } });
            }
            else{
              toast({
                title: '오류 발생',
                description: '가입정보를 찾을 수 없습니다.',
                status: 'error',
                duration: 9000,
                isClosable: true,
              });
              navigate('/signin');
              window.scrollTo(0,0);
            }
            
          } else {
            console.log('test1');
            toast({
              title: '오류 발생',
              description: data.message || '데이터 전송에 실패했습니다.',
              status: 'error',
              duration: 9000,
              isClosable: true,
            });
          }
        } catch (error) {
          console.log('test2');
          toast({
            title: '오류 발생',
            description: error.toString(),
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
        }
      };
      submitData();
    }
    
  }, [verify, name, phoneNumber, user_id, navigate, toast]);

  useEffect(() => {
    if (!verify && showToast) {
      toast({
        title: '인증 실패',
        description: '인증 실패',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      setShowToast(false);
    }
  }, [verify, showToast, toast]);

  return (
    <>
      {/* Form */}
      {/* Container은 중앙 배치용*/}

      <Box w="md" p={4} borderWidth="1px" borderRadius="lg">
        <form onSubmit={handleSubmit}>
          <FormLabel textAlign="left" fontSize="3xl" fontWeight="bold">
            비밀번호 찾기
          </FormLabel>

          <IdForm id={user_id} userIdError={userIdError} setId={setUser_Id} setUserIdError={setUserIdError} />

          <NameForm name={name} nameError={nameError} setName={setName} setNameError={setNameError} />

          <CertificationNumber
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            verificationCode={verificationCode}
            setVerificationCode={setVerificationCode}
            isClick={isClick}
            setClick={setClick}
            onVerificationExpired={setVerificationExpired}
            setVerify={setVerfiy}
            setShowToast={setShowToast}
          />
        </form>
      </Box>
    </>
  );
}

export default findPwd;
