import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Heading,
  useToast,
  Text,
  FormHelperText,
  FormErrorMessage,
} from '@chakra-ui/react';
import NewPwdForm from './components/NewPwdForm';
import { useNavigate, useLocation } from 'react-router-dom';

const findPwd2 = () => {
  const [newPwd, setNewPwd] = React.useState('');
  const [newPwdError, setNewPwdError] = React.useState(true);

  const [newPwd2, setNewPwd2] = useState('');
  const [newPwd2Error, setNewPwd2Error] = React.useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const userId = location.state ? location.state.user_id : '';

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!newPwdError && !newPwd2Error && newPwd === newPwd2) {
      try {
        const response = await fetch(`/api/users/change-pw/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userPwd: newPwd }),
        });
  
        if (response.ok) {
          // 비밀번호 변경 성공 시
          alert('비밀번호가 변경 되었습니다.');
          navigate('/signin');
          window.scrollTo(0, 0);
        } else {
          // 서버에서 오류 응답 시
          alert('서버에서 오류가 발생했습니다. 다시 시도해주세요.');
        }
      } catch (error) {
        // 네트워크 오류 등으로 인한 실패 시
        console.error('비밀번호 변경 요청 실패:', error);
        alert('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
      }
    } else {
      // 입력 조건이 맞지 않을 때
      alert('입력 조건을 확인해주세요.');
    }
  };

  return (
    <>
      <Box w="md" p={4} borderWidth="1px" borderRadius="lg">
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="left">
            <Text fontSize="3xl" width="100%" p={1} borderRadius="5px" display="block" fontWeight="bold">
              비밀번호 변경
            </Text>

            <NewPwdForm
              newPwd={newPwd}
              newPwdError={newPwdError}
              newPwd2={newPwd2}
              newPwd2Error={newPwd2Error}
              setNewPwd={setNewPwd}
              setNewPwdError={setNewPwdError}
              setNewPwd2={setNewPwd2}
              setNewPwd2Error={setNewPwd2Error}
            />

            <Button variant="unstyled" bgColor="#365BFF" textColor="white" w="full" type="submit">
              확인
            </Button>
          </VStack>
        </form>
      </Box>
    </>
  );
};

export default findPwd2;
