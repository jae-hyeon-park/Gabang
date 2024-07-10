import React, { useState } from 'react';
import { Box, Image, Flex, Modal, ModalOverlay, ModalContent, ModalCloseButton, useDisclosure } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

const ImageSlider = ({ images }) => {
  const [current, setCurrent] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const nextSlide = () => {
    if (current < images.length - 1) {
      setCurrent(current + 1);
    }
  };

  const prevSlide = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const openModal = () => {
    onOpen();
  };

  if (!Array.isArray(images) || images.length <= 0) {
    return null;
  }

  return (
    <Flex align="center" justify="center" position="relative">
      {current > 0 && (
        <ChevronLeftIcon
          w={8}
          h={8}
          color="black"
          cursor="pointer"
          position="absolute"
          left="10px"
          top="50%"
          transform="translateY(-50%)"
          onClick={prevSlide}
          zIndex={10}
        />
      )}
      {images.map((image, index) => (
        <Box key={index} display={index === current ? 'block' : 'none'} position="relative">
          <Image src={image} alt={`image-${index}`} boxSize="40vh" objectFit="contain" onClick={openModal} />
          <Flex justify="center" position="absolute" mt={3} w="full">
            {images.map((_, dotIndex) => (
              <Box
                key={dotIndex}
                h="3"
                w="3"
                bg={current === dotIndex ? 'color.gray_2' : 'color.gray_1'}
                m="0 2px"
                borderRadius="full"
              />
            ))}
          </Flex>
        </Box>
      ))}
      {current < images.length - 1 && (
        <ChevronRightIcon
          w={8}
          h={8}
          color="black"
          cursor="pointer"
          position="absolute"
          right="10px"
          top="50%"
          transform="translateY(-50%)"
          onClick={nextSlide}
          zIndex={10}
        />
      )}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton border="0px" m="5%" />
          <Image src={images[current]} alt={`Expanded image ${current}`} />
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default ImageSlider;
