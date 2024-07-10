import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from '@chakra-ui/form-control';
import React from 'react'
import { validateName } from '../../../utils/formValidation';
import { Input } from '@chakra-ui/input';

const NameForm = ({name, nameError, setName, setNameError}) => {

    const handleUserNameChange = (event) => {
        const userName = event.target.value;
        setName(userName);
        setNameError(userName ? !validateName(userName) : false); // validateId 함수를 호출하여 유효성 검사 수행
      };

  return (
    <FormControl mt={8} id="name" isRequired isInvalid={name && !validateName(name)}>
        <FormLabel fontSize="xl">이름</FormLabel>
        <Input name="name" type="text" value={name} onChange={handleUserNameChange}/>
        {name && !validateName(name) && (<FormErrorMessage>이름은 한글로 2~10자리여야 합니다.</FormErrorMessage>)}
    </FormControl>
  )
}

export default NameForm