import React from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, Flex } from '@chakra-ui/react';

function ConfirmationModal2({ isOpen, onConfirm, message, setShowModal}) {

  const closeModal = () => {
    setShowModal(false);
    if (onConfirm) onConfirm(); 
  };

  return (
    <Modal isOpen={isOpen} size="sm" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalBody mt={4} fontSize="lg" textAlign="center">
          {message}
        </ModalBody>
        <Flex justify="center" mt={4} mb={4}>
          {<Button bgColor="#3770FB" textColor="white" size="sm" mr={3} onClick={closeModal}
          _hover={{
            bgColor: '#3770FB',
            textColor: 'white',
          }}>
            확인
          </Button>}

        </Flex>
      </ModalContent>
    </Modal>
  );
}

export default ConfirmationModal2;
