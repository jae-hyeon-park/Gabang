import {
    FormControl,
    FormLabel,
    Input,
    FormHelperText,
    FormErrorMessage
  } from '@chakra-ui/react';
import { validateId } from '../../../utils/formValidation';

const IdForm= ({id, userIdError, setId, setUserIdError}) => {

    const handleUserIdChange = (event) => {
        const newUserId = event.target.value;
        setId(newUserId);
        setUserIdError(newUserId ? !validateId(newUserId) : false);
      };


  return (
    <FormControl mt={8} id="user_id" isRequired isInvalid={id && !validateId(id)}>
              <FormLabel fontSize="xl">아이디</FormLabel>

                <Input name="user_id" type="text" value={id} onChange={handleUserIdChange}/>
                {id && !validateId(id) && (<FormErrorMessage>아이디는 최소 영어, 한글, 숫자 1개를 포함한 2~10자리여야 합니다.</FormErrorMessage>)}

            </FormControl>
  )
}

export default IdForm