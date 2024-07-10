import React from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, Flex, Text } from '@chakra-ui/react';

function ConfirmationModal({ isOpen, onConfirm, onCancel, message, isConfirmButton, isCancelButtion }) {
  return (
    <Modal isOpen={isOpen} size="sm" isCentered onClose={onCancel}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody mt={4} fontSize="lg" textAlign="center">
          <Text whiteSpace="pre-line" data-cy="modal-text">{message}</Text>
        </ModalBody>
        <Flex justify="center" mt={4} mb={4}>
          {isConfirmButton && (<Button bgColor="#3770FB" textColor="white" size="sm" mr={isCancelButtion? 3 : 0} onClick={onConfirm}
          _hover={{
            bgColor: '#3770FB',
            textColor: 'white',
          }} data-cy="modal-button">
            확인
          </Button>)}
          {isCancelButtion && (<Button bgColor="#EDF2F7" textColor="black" size="sm" onClick={onCancel} mr={3}_hover={{
            bgColor: '#EDF2F7',
            textColor: 'black',
          }}>
            취소
          </Button>)}
        </Flex>
      </ModalContent>
    </Modal>
  );
}

export default ConfirmationModal;
