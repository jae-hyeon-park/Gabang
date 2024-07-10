import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, FormControl, FormLabel, Input, Button, Flex, Link, FormErrorMessage } from '@chakra-ui/react';
import { validateId, validatePassword } from '../../utils/formValidation';
import { removeCookie, setCookie } from '../../utils/cookie';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const SigninForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userId = location.state ? location.state.userId : '';

  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    userId: userId,
    userPwd: '',
  });
  const [isLoginFailedModalOpen, setIsLoginFailedModalOpen] = useState(false); // 로그인 실패 모달 상태
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!validateId(formData.userId)) {
      errors.userId = '아이디는 영어, 한글, 숫자 2~10자 이어야 합니다.';
    }
    if (!validatePassword(formData.userPwd)) {
      errors.userPwd = '비밀번호는 8~20자리의 영어, 숫자, 특수문자 조합이어야 합니다.';
    }
    else if (Object.keys(errors).length === 0) {
        setFormErrors({});
        const bodyFormData = new FormData();
        bodyFormData.append('username', formData.userId);
        bodyFormData.append('password', formData.userPwd);

        fetch('/api/login', {
          method: 'POST',
          body: bodyFormData,
        })
          .then(response => {
            if (!response.ok) {
              if (response.status === 401 || response.status === 403 || response.status === 404) {
                return response.text().then(errorMessage => {
                  setMessage(errorMessage);
                  setIsLoginFailedModalOpen(true);
                  throw new Error(errorMessage);
                });
              } else {
                setMessage('로그인에 실패했습니다.');
                setIsLoginFailedModalOpen(true);
                throw new Error('로그인에 실패했습니다.');
              }
            }
            const token = response.headers.get('Authorization');
            if (token) {
              removeCookie('token');
              setCookie('token', token, { path: '/' });
              navigate('/');
              window.scrollTo(0, 0);
            }
          })
          .catch(error => {
            setIsLoginFailedModalOpen(true); // 로그인 실패 시 모달 열기
          });
      } else {
        setFormErrors(errors);
      }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'userId') {
      if (!validateId(value)) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          userId: '아이디는 영어, 한글, 숫자 2~10자 이어야 합니다.',
        }));
      } else {
        setFormErrors((prevErrors) => {
          const { userId, ...restErrors } = prevErrors;
          return restErrors;
        });
      }
    }
    if (name === 'userPwd') {
      if (!validatePassword(value)) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          userPwd: '비밀번호는 8~20자리의 영어, 숫자, 특수문자 조합이어야 합니다.',
        }));
      } else {
        setFormErrors((prevErrors) => {
          const { userPwd, ...restErrors } = prevErrors;
          return restErrors;
        });
      }
    }
  };
  return (
    <Box w="md" p={4} borderWidth="1px" borderRadius="lg">
      <form onSubmit={handleSubmit}>
        <FormLabel textAlign="left" fontSize="3xl" fontWeight="bold">
          로그인
        </FormLabel>
        <FormControl id="userId" isRequired isInvalid={!!formErrors.userId}>
          <FormLabel fontSize="xl" mt={8}>
            아이디
          </FormLabel>
          <Input type="text" name="userId" value={formData.userId} onChange={handleChange} />
          <FormErrorMessage>{formErrors.userId}</FormErrorMessage>
        </FormControl>
        <FormControl id="userPwd" isRequired isInvalid={!!formErrors.userPwd} mt={8}>
          <FormLabel fontSize="xl">비밀번호</FormLabel>
          <Input type="password" name="userPwd" value={formData.userPwd} onChange={handleChange} />
          <FormErrorMessage>{formErrors.userPwd}</FormErrorMessage>
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
          }}>
          로그인
        </Button>
      </form>
      <Flex mt={4} justifyContent="space-evenly">
        <Link href="/help/id" fontSize="lg">
          아이디찾기
        </Link>
        <div> | </div>
        <Link href="/help/pw" fontSize="lg">
          비밀번호 찾기
        </Link>
        <div> | </div>
        <Link href="/signup/verify" fontSize="lg">
          회원가입
        </Link>
      </Flex>
      <ConfirmationModal
        isOpen={isLoginFailedModalOpen}
        message={message}
        isConfirmButton={true}
        isCancelButtion={false}
        onConfirm={() => setIsLoginFailedModalOpen(false)} // 확인 버튼 클릭 시 모달 닫기
        onCancel={() => setIsLoginFailedModalOpen(false)}
      />
    </Box>
  );
};

export default SigninForm;
