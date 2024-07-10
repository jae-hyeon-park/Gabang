import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Image
} from '@chakra-ui/react';

const Header2 = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <Box align="center" mb={10} mt={20}>
      <Button
        fontSize='5xl'
        fontWeight="bold"
        color='#3770FB'
        bgColor='white'
        _hover={{ bgColor: 'white' }}
        onClick={() => handleNavigate(`/`)}
        transition="none"
        >
        <Image src='/images/logo1(ko).png' style={{ width: '180px' }} />
      </Button>
    </Box>
  );
};

export default Header2;