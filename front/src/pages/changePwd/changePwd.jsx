import { useToast } from '@chakra-ui/toast';
import React, { useState } from 'react';
import { Box, Heading, Text, VStack, Flex } from '@chakra-ui/layout';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import NewPwdForm from '../findPwd/components/NewPwdForm';
import { Button } from '@chakra-ui/button';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom/dist';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { getCookie } from '../../utils/cookie';
import { getPayload } from '../../utils/cookie';

const changePwd = ({}) => {
  const location = useLocation();
  const { userId } = location.state;
  const [pwd, setPwd] = React.useState('');
  const [newPwd, setNewPwd] = React.useState('');
  const [newPwdError, setNewPwdError] = React.useState(true);
  const [newPwd2, setNewPwd2] = useState('');
  const [newPwd2Error, setNewPwd2Error] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [ismodalCloseState, setIsModalCloseState] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(-1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
        const response = await fetch(`/api/admin/pwd-change/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getCookie('token')
            },
            body: JSON.stringify({ "pwd": pwd, "newPwd": newPwd })
        });
        
        if (response.ok) {
            setModalMessage('비밀번호가 성공적으로 변경되었습니다.');
            setIsModalCloseState(false);
            setIsModalOpen(true);
        } else {
            const errorMessage = await response.text();
            setModalMessage(errorMessage || '데이터 전송에 실패했습니다.');
            setIsModalCloseState(true);
            setIsModalOpen(true);
        }
    } catch (error) {
        setModalMessage(error.message || '데이터 전송에 실패했습니다.');
        setIsModalCloseState(true);
        setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate(`/my/${userId}`);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Box w="md" p={4} borderWidth="1px" borderRadius="lg" mt={16}>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="left">
            <Text fontSize="3xl" width="100%" p={1} borderRadius="5px" display="block" fontWeight="bold">
              비밀번호 변경
            </Text>

            <FormControl id="pwd" isRequired my={5}>
              <FormLabel fontSize="xl">현재 비밀번호 입력</FormLabel>

              <Input maxLength="20" name="pwd" type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} />
            </FormControl>

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

            <Flex>
              <Button variant="unstyled" bgColor="color.blue" textColor="white" fontSize="xl" w="full" mr="1%" type="submit">
                변경
              </Button>
              <Button variant="unstyled" bgColor="color.gray_1" textColor="white" fontSize="xl" w="full" ml="1%" onClick={() => handleNavigate()}>
                취소
              </Button>
            </Flex>
          </VStack>
        </form>
      </Box>
      <ConfirmationModal 
        isOpen={isModalOpen} 
        onConfirm={!ismodalCloseState ? handleModalClose : () => setIsModalOpen(false)} // 수정된 부분
        message={modalMessage} 
        isConfirmButton 
      />
    </>
  );
};

export default changePwd;
