import { Box, Button } from '@chakra-ui/react';

const RenderMenu = ({ menuList, handleMenuClick }) => {
  return menuList.map((menu, index) => (
    <Box key={index} width="100%" _hover={{ bgColor: 'white' }}>
      <Button
        width="100%"
        _hover={{ textColor: 'color.blue' }}
        variant="ghost"
        fontSize="xl"
        _active={{ bgColor: 'transparent' }}
        // color={selectedMenu === menu ? 'blue' : 'inherit'}
        onClick={() => handleMenuClick(menu)}>
        {menu}
      </Button>
    </Box>
  ));
};

export default RenderMenu;
