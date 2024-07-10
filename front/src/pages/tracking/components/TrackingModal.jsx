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
} from '@chakra-ui/react';

const TrackingModal = ({
  isOpen,
  onClose,
  companyList,
  selectedCourier,
  setSelectedCourier,
  trackingNumber,
  setTrackingNumber,
  handleInputComplete,
  product,
  postDeliveryInfo,
}) => {
  const handleCourierChange = (event) => {
    setSelectedCourier(event.target.value);
  };

  const handleTrackingNumberChange = (event) => {
    setTrackingNumber(event.target.value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent p={5}>
        <ModalHeader>송장번호 입력</ModalHeader>
        <ModalCloseButton p={10} _hover={{ bgColor: 'transparent' }} />
        <ModalBody>
          <FormControl mt={4}>
            <Select
              variant="filled"
              placeholder="택배사를 선택하세요"
              onChange={handleCourierChange}
              value={selectedCourier}>
              {companyList.map((company) => (
                <option key={company.Code} value={company.Code}>
                  {company.Name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl mt={5}>
            <Input
              type="number"
              variant="filled"
              value={trackingNumber}
              onChange={handleTrackingNumberChange}
              placeholder="송장 번호를 입력하세요"
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            color="white"
            bgColor="color.blue"
            onClick={postDeliveryInfo}
            _hover={{ bgColor: 'color.blue', textColor: 'white' }}>
            입력 완료
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TrackingModal;
