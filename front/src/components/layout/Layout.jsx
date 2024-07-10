import React from 'react';
import { Box } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Header2 from './Header2';
import Footer2 from './Footer2';

const Layout = ({ children }) => {
  const location = useLocation();
  const noLayoutPaths = [
    '/signin',
    '/help/id',
    '/help/id2',
    '/help/pw',
    'help/pw2',
    '/signup/verify',
    '/signup/detail',
    '/signup/complete',
  ];
  const showLayout = !noLayoutPaths.includes(location.pathname);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      // w="1280px"
      // margin="0 17%"
      width="100%"
      margin="0 auto"
      //className="blue-overlay" 메인 전체 색깔 바꾸는 용도
      >
      {showLayout ? <Header /> : <Header2 />}
      <Box minH={showLayout ? '100vh' : '0'} overflowY="auto" my={showLayout ? 24 : 0}>
        {children}
      </Box>
      {showLayout ? <Footer /> : <Footer2 />}
    </Box>
  );
};
export default Layout;
