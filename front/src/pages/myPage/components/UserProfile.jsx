import { Box, Flex, Text, Spacer, Avatar, ButtonGroup, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const UserProfile = ({ user }) => {
  const navigate = useNavigate();
  const handleNavigate = (user) => {
    navigate(`/my/update/${user.userId}`, {
      state: {
        userId: user.userId,
        userName: user.userName,
        userPhoneNumber: user.userPhoneNumber,
        userAccount: user.userAccount,
        cdBankcode: user.cdBankcode,
        joinDate: user.joinDate,
        isInsurance: user.isInsurance,
      },
    }),
      window.scrollTo(0, 0);
  };

  return (
    <Box borderWidth="1px" borderRadius="xl" height="110px" display="flex" flexDirection="row" alignItems="center">
      <Flex alignItems="center" width="100%" margin="30px">
        <Avatar name="" src="https://bit.ly/broken-link"></Avatar>
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          <Text as="b" fontSize="lg" ml={5}>
            {user.userId}
          </Text>
          <Text color="gray" fontSize="md" ml={5}>
            {user.isInsurance ? '보험가입여부: Y' : '보험가입여부: N'}
          </Text>
        </Box>
        <Spacer />
        <ButtonGroup>
          <Button
            as="a"
            href="https://spot.wooribank.com/pot/Dream?withyou=is"
            target="_blank"
            bgColor="color.blue"
            color="white"
            _hover={{ bgColor: 'color.blue' }}
            size="sm"
            width="80px">
            보험 가입
          </Button>
          <Button
            bgColor="color.blue"
            color="white"
            _hover={{ bgColor: 'color.blue' }}
            size="sm"
            width="80px"
            onClick={() => handleNavigate(user)}>
            내 정보
          </Button>
        </ButtonGroup>
      </Flex>
    </Box>
  );
};

export default UserProfile;
