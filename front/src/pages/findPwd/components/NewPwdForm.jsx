import React from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react';
import { validatePassword } from '../../../utils/formValidation';

const NewPwdForm = ({newPwd, newPwdError, newPwd2, newPwd2Error, setNewPwd, setNewPwdError, setNewPwd2, setNewPwd2Error,
}) => {

  // 비밀번호 변경 핸들러
  const handleUserPwdChange = (event) => {
    const newUserPwd = event.target.value;
    setNewPwd(newUserPwd);
    // 새 비밀번호 유효성 검사 (입력이 있을 경우에만)
    if(newUserPwd) {
      setNewPwdError(!validatePassword(newUserPwd));
    }
  };

  // 비밀번호 확인 변경 핸들러
  const handleUserPwdChange2 = (event) => {
    const newUserPwd2 = event.target.value;
    setNewPwd2(newUserPwd2);
    // 입력이 두 필드 모두 있을 경우에만 일치 여부 검사
    if(newPwd && newUserPwd2) {
      setNewPwd2Error(newPwd !== newUserPwd2);
    }
  };

  return (
    <>
      <FormControl id="newPwd" isRequired isInvalid={newPwd && newPwdError}>
        <FormLabel fontSize='xl'>새 비밀번호 입력</FormLabel>
        <Input maxLength="20" name="newPwd" type="password" value={newPwd} onChange={handleUserPwdChange}/>
        {newPwd && newPwdError && (<FormErrorMessage>비밀번호는 영어, 숫자, 특수문자 포함하여 8~20자리입니다.</FormErrorMessage>)}
      </FormControl>

      <FormControl id="newPwd2" isRequired my={5} isInvalid={newPwd && newPwd2 && newPwd2Error}>
        <FormLabel fontSize='xl'>새 비밀번호 확인</FormLabel>
        <Input maxLength="20" name="newPwd2" type="password" value={newPwd2} onChange={handleUserPwdChange2}/>
        {newPwd && newPwd2 && !newPwd2Error ? (
          <FormHelperText>비밀번호가 일치합니다.</FormHelperText>
        ) : (
          newPwd && newPwd2 && <FormErrorMessage>비밀번호가 일치하지 않습니다.</FormErrorMessage>
        )}
      </FormControl>
    </>
  );
};

export default NewPwdForm;
