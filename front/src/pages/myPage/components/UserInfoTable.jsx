import {Input, Text, TableContainer, Table, Thead, Tbody, Th, Tr, Td, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getCookie } from '../../../utils/cookie';

const UserInfoTable = ({ users }) => {
  const { isOpen: isOpenSuspensionModal, onOpen: onOpenSuspensionModal, onClose: onCloseSuspensionModal } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [message, setMessage] = useState('');
  const currentDate = new Date().toISOString().split('T')[0];

  const navigate = useNavigate();

  const handleNavigate = (user) => {
    navigate(`/my/update/${user.userId}`, {
      state: {
        userId: user.userId,
        userPwd: user.userPwd,
        userPhoneNumber: user.userPhoneNumber,
        userAccount: user.userAccount,
        cdBankcode: user.cdBankcode
      }
    }), window.scrollTo(0, 0);
  };

  const saveSuspension = (selectedDate) => {
    const suspensionData = {
      suspensionStart: currentDate,
      suspensionEnd: selectedDate,
      suspensionCount: 1,
      userId: selectedUser.userId
    };
    
    fetch(`/api/admin/suspensions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getCookie('token')
      },
      body: JSON.stringify(suspensionData)
    })
    .then((response) => response.text())
    .then((message) => {console.log(message), alert("해당 대상에게 정지가 적용되었습니다.")})
    .catch((error) => {
      console.error('fetch error at updateSuspension');
    });
  };

  const handleDateChange = (event) => {
    const selectedDateValue = event.target.value;
    setSelectedDate(selectedDateValue);
  };

  const handleSuspensionModalOpen = (user) => {
    setSelectedUser(user);
    console.log(typeof selectedUser.suspensionEnd);
    onOpenSuspensionModal();
  };

  const renderEmptyBody = () => {
    return (
      <Tr>
        <Td colSpan={5} textAlign="center">검색 결과가 없습니다.</Td>
      </Tr>
    );
  };

  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th textAlign='center'>닉네임</Th>
            <Th textAlign='center'>가입일</Th>
            <Th textAlign='center'>보험가입</Th>
            <Th textAlign='center'>정보수정</Th>
            <Th textAlign='center'>정지설정</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.length === 0 ? renderEmptyBody() : users.map((user, index) => (
            <Tr key={index}>
              <Td textAlign='center'>{user.userId}</Td>
              <Td textAlign='center'>{user.joinDate.split('T')[0]}</Td>
              <Td textAlign='center'>{user.ynInsurance ? 'Y' : 'N'}</Td>
              <Td textAlign='center'>
                <Button size='xs' onClick={() => handleNavigate(user)}>정보수정</Button>
              </Td>
              <Td textAlign='center'>
                <Button size='xs' onClick={() => handleSuspensionModalOpen(user)}>정지설정</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Modal isOpen={isOpenSuspensionModal} onClose={onCloseSuspensionModal} closeOnOverlayClick={false}>
        <ModalOverlay>
        <ModalContent>
          <ModalHeader fontSize={25}>
            정지 종료일 설정
          </ModalHeader>
          <ModalBody>
            <Text>{`대상: ${selectedUser.userId}`}</Text>
            <Text>{`기존 종료일: ${selectedUser.suspensionEnd ? selectedUser.suspensionEnd.split('T')[0] : '없음'}`}</Text>
            <Input
              type='date'
              size='md'
              mt={4}
              min={currentDate}
              onChange={handleDateChange} />
          </ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              bgColor="#3770FB"
              textColor="white"
              _hover={{ bgColor: '#3770FB', textColor: 'white' }}
              onClick={() => saveSuspension(selectedDate)}>
              확인
            </Button>
            <Button
              bgColor='#EDF2F7'
              textColor='black'
              _hover={{ bgColor: '#EDF2F7', textColor: 'black' }}
              onClick={onCloseSuspensionModal}>
              취소
            </Button>
          </ModalFooter>
        </ModalContent>
        </ModalOverlay>
      </Modal>
    </TableContainer>
  );
};

export default UserInfoTable;