import React from 'react';
import { Box, Container, Grid, Text, VStack, HStack, Link, Flex, Icon, Divider } from '@chakra-ui/react';
import { EmailIcon, InfoIcon, PhoneIcon, AtSignIcon } from '@chakra-ui/icons';

const Footer2 = () => {
  return (
    <Box>
      <Container as="footer" maxW="container.lg" pb={10} mt={10}>
        <Flex justifyContent="space-between">
          <HStack align="center" spacing={3}>
            <Link href="#" isExternal>
              <Text>이용약관</Text>
            </Link>
            <div> | </div>
            <Link href="#" isExternal>
              <Text>개인정보처리방침</Text>
            </Link>
            <div> | </div>
            <Link href="#" isExternal>
              <Text>분쟁처리절차</Text>
            </Link>
            <div> | </div>
            <Link href="#" isExternal>
              <Text>고객센터</Text>
            </Link>
          </HStack>
        </Flex>
        <Text fontSize="sm" mt={2} textAlign="center">
          © 2024 가방 Inc. All rights reserved.
        </Text>
      </Container>
    </Box>
  );
};

export default Footer2;
