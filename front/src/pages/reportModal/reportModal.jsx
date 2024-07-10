import { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  ModalFooter,
  Button,
  Select,
  Input,
  Textarea,
  Text,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

import reportCategories from './reportCategories';
import { getPayload, getCookie } from '../../utils/cookie';
const reportModal = ({ isOpenReportModal, onCloseReportModal, productId, selectedReport }) => {
  const [inputCount, setInputCount] = useState(selectedReport ? selectedReport.reportDetail.length : 0); //글자수
  const [showAlert, setShowAlert] = useState(false);
  const [title, setTitle] = useState(selectedReport ? selectedReport.reportTitle : '');
  const [category, setCategory] = useState(selectedReport ? selectedReport.reportType : '');
  const [content, setContent] = useState(selectedReport ? selectedReport.reportDetail : '');

  const isFormValid = title && content && category;

  const userId = getPayload('token') == null ? '0' : getPayload('token').userId;

  useEffect(() => {
    if (selectedReport) {
      // 선택된 신고가 있을 때 모달의 상태를 업데이트합니다.
      setInputCount(selectedReport.reportDetail.length);
      setTitle(selectedReport.reportTitle);
      setCategory(selectedReport.reportType);
      setContent(selectedReport.reportDetail);
    } else {
      // 선택된 신고가 없을 때 모달의 상태를 초기화합니다.
      setInputCount(0);
      setTitle('');
      setCategory('');
      setContent('');
    }
  }, [selectedReport]);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleCategoryChange = (event) => {
    if (!selectedReport) setCategory(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const postReport = async () => {
    const report = {
      userId,
      productId,
      reportTitle: title,
      reportType: category,
      reportDetail: content,
    };

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getCookie('token'),
        },
        body: JSON.stringify(report),
      });

      if (response.ok) {
        setShowAlert(true);
        setTimeout(() => {
          onCloseReportModal();
        }, 2500);
      } else {
        const errorData = await response.json();
        alert(errorData.message || '신고 제출에 실패했습니다.');
        setShowAlert(false);
      }
    } catch (error) {
      alert('네트워크 오류가 발생했습니다.');
      setShowAlert(false);
    }
  };

  const handleShowModal = () => {
    setShowAlert(false);
    onCloseReportModal();
  };
  return (
    <>
      <Modal closeOnOverlayClick={true} size="lg" isOpen={isOpenReportModal} onClose={onCloseReportModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader ml={6} mt={7} fontSize={25}>
            신고하기
          </ModalHeader>

          <ModalCloseButton mr={8} mt={10} size="3xl" />
          <ModalBody pb={6}>
            <FormControl mt={5} px={4}>
              <Input
                variant="filled"
                value={title}
                onChange={handleTitleChange}
                placeholder="제목을 입력하세요 (최대 20자)"
                maxLength="20"
                disabled={selectedReport ? true : false}
              />
            </FormControl>

            <FormControl mt={6} px={4}>
              <Select
                variant="filled"
                placeholder="카테고리를 선택하세요"
                value={category}
                onChange={handleCategoryChange}
                disabled={selectedReport ? true : false}>
                {Object.entries(reportCategories).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl mt={6} px={4}>
              <Textarea
                resize="none"
                variant="filled"
                rows="10"
                value={content}
                onChange={(e) => {
                  handleContentChange(e);
                  setInputCount(e.target.value.length);
                }}
                placeholder="내용을 입력하세요 (최대 500자)"
                maxLength="500"
                disabled={selectedReport ? true : false}
              />
              <Text mr="1" textAlign="right">
                {inputCount}/500
              </Text>
            </FormControl>

            <Text mt={6} px={4} fontSize="lg">
              <CheckIcon color="color.blue" mr={2} />
              신고 내용은 수정이 불가하니 신중히 작성해주세요.
              <br />
              <CheckIcon color="color.blue" mr={2} />
              신고 처리는 평일 기준 3일 정도 소요됩니다.
            </Text>
          </ModalBody>

          <ModalFooter>
            {showAlert ? (
              <Alert status="success" variant="solid" mb={4}>
                <AlertIcon />
                제출 완료
              </Alert>
            ) : (
              <Button
                p={5}
                mr={4}
                mb={5}
                mt={1}
                bgColor="color.blue"
                textColor="white"
                onClick={selectedReport ? handleShowModal : postReport}
                isDisabled={!isFormValid}
                _hover={{ bgColor: 'color.blue', textColor: 'white' }}>
                {selectedReport ? '닫기' : '확인'}
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default reportModal;
