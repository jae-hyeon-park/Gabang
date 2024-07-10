// src/components/DetailForm.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  Select,
  InputGroup,
  InputRightElement,
  Icon,
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { validateAccount, validateId, validateName, validatePassword } from '../../utils/formValidation';

const DetailForm = () => {
  const [formErrors, setFormErrors] = useState({});
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [isUseridAvailable, setIsUseridAvailable] = useState(false);
  const [isCheckingUserId, setIsCheckingUserId] = useState(false);
  const handleClick = () => setShow(!show);
  const handleClick2 = () => setShow2(!show2);
  const navigate = useNavigate();
  const location = useLocation();

  const phoneNumber = location.state ? location.state.phoneNumber : '';

  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    phoneNumber: phoneNumber,
    userid: '',
    password: '',
    confirmPassword: '',
    bank: '',
    accountNumber: '',
  });

  useEffect(() => {
    if (!phoneNumber) {
      alert('전화번호 인증이 필요합니다.');
      navigate('/signup/verify');
      window.scrollTo(0,0);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'userid') {
      setIsUseridAvailable(false);
      if (!validateId(value)) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          userid: '아이디는 영어, 한글, 숫자 2~10자 이어야 합니다.',
        }));
      } else {
        setFormErrors((prevErrors) => {
          const { userid, ...restErrors } = prevErrors;
          return restErrors;
        });
      }
    }
    if (name === 'password') {
      if (!validatePassword(value)) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          password: '비밀번호는 8~20자리의 영어, 숫자, 특수문자 조합이어야 합니다.',
        }));
      } else {
        setFormErrors((prevErrors) => {
          const { password, ...restErrors } = prevErrors;
          return restErrors;
        });
      }
    }
    if (name === 'confirmPassword') {
      if (formData.password !== value) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          confirmPassword: '비밀번호가 일치하지 않습니다.',
        }));
      } else {
        setFormErrors((prevErrors) => {
          const { confirmPassword, ...restErrors } = prevErrors;
          return restErrors;
        });
      }
    }
    if (name === 'name') {
      if (!validateName(value)) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          name: '이름은 한글 2~10자 이어야 합니다.',
        }));
      } else {
        setFormErrors((prevErrors) => {
          const { name, ...restErrors } = prevErrors;
          return restErrors;
        });
      }
    }
    if (name === 'accountNumber') {
      const trimmedValue = value.replace(/\D/g, '').slice(0,14);
      if (trimmedValue.length < 11 || trimmedValue.length > 14 || !validateAccount(trimmedValue)) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          accountNumber: '계좌번호는 11~14자리의 숫자만 입력해주세요.',
        }));
        setFormData((prevData) => ({
          ...prevData,
          accountNumber: trimmedValue.slice(0, 14),
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          accountNumber: trimmedValue,
        }));
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          accountNumber: '',
        }));
      }
    }
    
  };

  const handleCheckUserid = async () => {
    if (!formData.userid) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        userid: '아이디를 입력해주세요.',
      }));
      return;
    }
    else if(validateId(formData.userid)) {
      setIsCheckingUserId(true); // 사용자 ID 확인 시작
      try {
        const response = await fetch(`/api/users/check-id/${formData.userid}`);
        const data = await response.json();
        if (response.ok) {
          if (data === true) {
            setIsUseridAvailable(true);
            setFormErrors((prevErrors) => ({
              ...prevErrors,
              userid: '', // 아이디 중복 오류 클리어
            }));
            alert('중복확인이 완료되었습니다.');
          } else {
            setIsUseridAvailable(false);
            setFormErrors((prevErrors) => ({
              ...prevErrors,
              userid: '이미 사용 중인 아이디입니다.',
            }));
          }
        } else {
          setIsUseridAvailable(false);
          // 서버에서의 오류 응답 처리
          console.error('사용자 ID 가용성 확인 실패:', data);
          // 필요한 경우 적절한 오류 상태를 설정할 수 있습니다.
        }
      } catch (error) {
        setIsUseridAvailable(false);
        console.error('사용자 ID 가용성 확인 중 오류 발생:', error);
        // 필요한 경우 적절한 오류 상태를 설정할 수 있습니다.
      } finally {
        setIsCheckingUserId(false); // 사용자 ID 확인 종료
      }
    }
    else {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        userid: '아이디는 영어, 한글, 숫자 2~10자 이어야 합니다.',
      }));
      return;
    }
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.phoneNumber < 1) {
      alert('전화번호 인증이 필요합니다.');
      navigate('/signup/verify');
      window.scrollTo(0,0);
      return;
    }

    const errors = {};
    if (!formData.name) errors.name = '이름을 입력하세요.';
    if (!formData.dob || formData.dob.length !== 10) errors.dob = '생년월일을 입력하세요.';
    if (!formData.userid) errors.userid = '아이디를 입력하세요.';
    if (!formData.password) errors.password = '비밀번호를 입력하세요.';
    if (!formData.confirmPassword || formData.password !== formData.confirmPassword) {
      errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }
    if (!formData.bank) errors.bank = '은행을 선택하세요.';
    if (!formData.accountNumber) errors.accountNumber = '계좌번호를 입력하세요.';

    if (!isUseridAvailable) {
      errors.userid = '아이디 중복을 확인해주세요.';
    }

    if (!/^\d*$/.test(formData.accountNumber)) {
      errors.accountNumber = '계좌번호는 숫자만 입력해주세요.';
    }
    if (formData.accountNumber.length > 14 || formData.accountNumber.length < 11) {
      errors.accountNumber = '계좌번호는 11~14자리의 숫자만 입력해주세요.';
    }
    if (!validateName(formData.name)) {
      errors.name = '이름은 한글 2~10자 이어야 합니다.';
    }
    if (!validateId(formData.userid)) {
      errors.userid = '아이디는 영어, 한글, 숫자 2~10자 이어야 합니다.';
    }
    if (!validatePassword(formData.password)) {
      errors.password = '비밀번호는 8~20자리의 영어, 숫자, 특수문자 조합이어야 합니다.';
    }

    if (Object.keys(errors).length === 0) {
      setFormErrors({});
      try {
        const response = await fetch('/api/users/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            userId:formData.userid, 
            userPwd:formData.password, 
            userName:formData.name, 
            userPhoneNumber:formData.phoneNumber, 
            userBirthdate:formData.dob.replace(/-/g, ''), 
            cdBankcode:formData.bank, 
            userAccount:formData.accountNumber }),
        });
        
        if (response.ok) {
          navigate('/signup/complete');
          window.scrollTo(0, 0);
        } else {
          alert('회원가입에 실패했습니다. 다시 시도해주세요.');
        }
      } catch (error) {
        console.error('회원가입 요청 실패:', error);
        alert('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    } else {
      setFormErrors(errors);
    }
  };

  return (
    <Box w="md" p={4} borderWidth="1px" borderRadius="lg">
      <form onSubmit={handleSubmit}>
        <FormLabel fontSize="3xl" fontWeight="bold">
          회원가입
        </FormLabel>
        <FormControl isRequired isInvalid={!!formErrors.phoneNumber} mt={4}>
          <FormLabel fontSize="xl" mt={8}>
            전화번호
          </FormLabel>
          <Input
            type="number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            isDisabled={true}
          />
          <FormErrorMessage>{formErrors.phoneNumber}</FormErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={!!formErrors.name}>
          <FormLabel fontSize="xl" mt={8}>
            이름
          </FormLabel>
          <Input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="한글 2~10자리" />
          <FormErrorMessage>{formErrors.name}</FormErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={!!formErrors.dob} mt={4}>
          <FormLabel fontSize="xl" mt={8}>
            생년월일 (YYYY-MM-DD)
          </FormLabel>
          <Input name="dob" placeholder="" size="md" type="date" value={formData.dob} onChange={handleChange} />
          <FormErrorMessage>{formErrors.dob}</FormErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={!!formErrors.userid} mt={4}>
          <FormLabel fontSize="xl" mt={8}>
            아이디
          </FormLabel>
          <InputGroup>
            <Input
              type="text"
              name="userid"
              value={formData.userid}
              onChange={handleChange}
              placeholder="영어, 한글, 숫자 2~10자"
            />
            <InputRightElement width="4.5rem">
              {isUseridAvailable ? (
                <Box color="green">✓</Box>
              ) : (
                <Button h="1.75rem" size="sm" mr="2" onClick={handleCheckUserid} isDisabled={isUseridAvailable}>
                  중복확인
                </Button>
              )}
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{formErrors.userid}</FormErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={!!formErrors.password} mt={4}>
          <FormLabel fontSize="xl" mt={8}>
            비밀번호
          </FormLabel>
          <InputGroup size="md">
            <Input
              name="password"
              pr="4.5rem"
              type={show ? 'text' : 'password'}
              placeholder="영어, 숫자, 특수문자 조합 8~20자"
              value={formData.password}
              onChange={handleChange}
            />
            <InputRightElement>
              <Button size="md" onClick={handleClick} variant="ghost" _hover={{ bg: 'transparent' }}>
                {show ? <ViewOffIcon /> : <ViewIcon />}
              </Button>
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{formErrors.password}</FormErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={!!formErrors.confirmPassword} mt={4}>
          <FormLabel fontSize="xl" mt={8}>
            비밀번호 확인
          </FormLabel>
          <InputGroup size="md">
            <Input
              name="confirmPassword"
              pr="4.5rem"
              type={show2 ? 'text' : 'password'}
              placeholder=""
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <InputRightElement>
              <Button size="md" onClick={handleClick2} variant="ghost" _hover={{ bg: 'transparent' }}>
                {show2 ? <ViewOffIcon /> : <ViewIcon />}
              </Button>
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{formErrors.confirmPassword}</FormErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={!!formErrors.bank} mt={4}>
          <FormLabel fontSize="xl" mt={8}>
            은행
          </FormLabel>
          <Select name="bank" value={formData.bank} onChange={handleChange} placeholder="은행을 선택하세요.">
            <option value="01">우리은행</option>
            <option value="02">국민은행</option>
            <option value="03">토스뱅크</option>
          </Select>
          <FormErrorMessage>{formErrors.bank}</FormErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={!!formErrors.accountNumber} mt={4}>
          <FormLabel fontSize="xl" mt={8}>
            계좌번호
          </FormLabel>
          <Input
            type="number"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            placeholder="-없이 숫자만 입력"
          />
          <FormErrorMessage>{formErrors.accountNumber}</FormErrorMessage>
        </FormControl>
        <Button
          type="submit"
          bgColor="#3770FB"
          textColor="white"
          fontSize="xl"
          mt={8}
          w="100%"
          _hover={{
            bgColor: '#3770FB',
            textColor: 'white',
          }}>
          가입하기
        </Button>
      </form>
    </Box>
  );
};

export default DetailForm;
