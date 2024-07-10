import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Flex,
  IconButton,
  Stack,
  Image,
  Text,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

import ConfirmationModal2 from '../../components/common/ConfirmationModal2';
import { checkDeliveryFee, checkTransactionMethod } from './components/check';
import { getCookie, getPayload } from '../../utils/cookie';
import ProductForm from './components/ProductForm';

const createProduct = () => {
  const navigate = useNavigate();

  const [noPassImage, setNoPassImage] = useState([]);

  const [productName, setProductName] = useState('');
  const [productImages, setProductImages] = useState([]); //이미지 담는 곳
  const [passImage, setPassImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = React.createRef();

  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');

  const [checkedItems, setCheckedTransactionMethod] = useState([]);

  const [transactionPlace, setTransactionPlace] = useState('');
  const [includeDeliveryFee, setIncludeDeliveryFee] = useState('');
  const [description, setDescription] = useState('');

  const [showModal, setShowModal] = useState(false); // 모달의 상태를 관리합니다.
  const [message, setMessage] = useState('');

  const formSetting = {
    productName,
    setProductName,
    category,
    setCategory,
    price,
    setPrice,
    checkedItems,
    setCheckedTransactionMethod,
    transactionPlace,
    setTransactionPlace,
    includeDeliveryFee,
    setIncludeDeliveryFee,
    description,
    setDescription,
  };

  const handleImageChange = (e) => {
    setPassImage(false);

    if (e.target.files) {
      let filesArray = Array.from(e.target.files);
      let newSelectedCount = filesArray.length;

      const totalImages = productImages.length + newSelectedCount;

      // 만약 총 이미지 개수가 3개를 초과한다면 초과하는 만큼 제외
      if (totalImages > 5) {
        filesArray = filesArray.slice(0, 5 - productImages.length);
      }

      let flag = false;

      // 새 이미지와 파일 객체 추가
      const newImagesData = filesArray.map((file) => {
 
        if(file.name.split('.').pop().toLowerCase() == "jpg" || file.name.split('.').pop().toLowerCase() == 'jpeg' || file.name.split('.').pop().toLowerCase() == 'png'){

        }else{
          flag = true;
          alert("jpg, jpeg, png만 업로드 가능합니다.");
        }

        return {
          url: URL.createObjectURL(file),
          file: file, // 파일 객체 저장
        };
      });

      if(flag){
        return;
      }
      else
        setProductImages([...productImages, ...newImagesData]);
    }
  };

  const removeImage = (imageToRemove) => {
    const updatedImages = productImages.filter((image) => image !== imageToRemove);
    setProductImages(updatedImages);
    setPassImage(false);
    setErrorMessage('');

    // 선택된 파일 개수가 2개이하가 되면 input 태그의 value를 초기화
    if (updatedImages.length < 2 && fileInputRef.current) {
      fileInputRef.current.value = '';
      setPassImage(false);
    }
  };

  const renderImages = () => {
    return productImages.map((image, index) => (
      <Box key={image.url} p={2} position="relative" border="2px solid" borderColor="gray.200" borderRadius="md">
        <IconButton
          aria-label="Delete image"
          icon={<CloseIcon />}
          onClick={() => removeImage(image)}
          position="absolute"
          top="0" // 위치 조정 필요에 따라 값 조정
          right="0" // 위치 조정 필요에 따라 값 조정
          size="sm"
          // bgColor="red.500" // 아이콘 배경색을 빨간색으로 설정

          _hover={{
            bg: 'color.red',
          }}
        />
        <Image
          src={image.url}
          alt={`Product preview ${index + 1}`}
          boxSize="200px" // 이미지 기본 크기를 더 크게 설정
          objectFit="cover"
        />
      </Box>
    ));
  };

  const handleVerifyImages = async () => {
    if (productImages.length > 1) {
      try {
        // 모든 이미지에 대해 검증 요청을 보냅니다.
        const imageVerificationPromises = productImages.map((imageData) => {
          const formData = new FormData();
          formData.append('image', imageData.file);

          return fetch('/node/search-by-image', {
            method: 'POST',
            body: formData,
          }).then((response) => response.json());
        });
        // 모든 요청의 결과를 기다립니다.
        const results = await Promise.all(imageVerificationPromises);
        const failedImages = results.reduce((acc, result, index) => {
          if (result.check) {
            return [...acc, productImages[index].file.name];
          }
          return acc;
        }, []);
        const percent = ((productImages.length - failedImages.length) / productImages.length) * 100;

        if (percent < 60) {
          const errorMessage1 = failedImages.join(', ') + ' 이미지가 웹상에 존재하여 검증을 실패하였습니다.';
          setErrorMessage(errorMessage1);
          setPassImage(false);
        } else {
          setPassImage(true);
        }
      } catch (error) {
        console.error('Error verifying images:', error);
        setErrorMessage('잠시후 다시 시도해주세요.');
        setPassImage(false);
      }
    } else {
      setMessage('최소 2개의 이미지를 검증해주세요');
      setShowModal(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 제출 기본 이벤트 방지

    //id받아오기
    const user = getPayload('token').userId;

    if (checkedItems.length === 0) {
      return; // 체크박스가 하나도 선택되지 않았으면 제출 중단
    }

    // FormData 객체 생성
    const formData = new FormData();
    productImages.forEach((imageData, index) => {
      formData.append('images', imageData.file);
    });

    try {
      // 나머지 데이터와 함께 업로드된 이미지 URL을 API로 전송
      const otherData = {
        productName,
        // images: productImages, // 이미지 배열 자체를 보냄
        categoryId: parseInt(category),
        productPrice: parseInt(price),
        tradeWay: checkTransactionMethod(checkedItems),
        tradeLocation: transactionPlace,
        ynDeliveryfee: checkDeliveryFee(includeDeliveryFee),
        productExplain: description,
        userId: user, //나중에 받아온 값으로 변경
      };

      formData.append('data', new Blob([JSON.stringify(otherData)], { type: 'application/json' }));

      // 상품 데이터를 서버에 제출
      // 이 부분은 서버의 엔드포인트 URL과 설정에 맞게 수정해야 합니다.
      const submitResponse = await fetch('/api/products', {
        method: 'POST',
        headers: {
          Authorization: getCookie('token'),
        },
        body: formData,
      });

      if (submitResponse.ok) {
        // 성공적으로 제출되었을 때의 로직
        setMessage('물품이 등록 되었습니다.');
        setShowModal(true);
      } else {
        // 제출 실패 시
        setMessage('등록 실패');
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error during image upload:', error);
    }
  };

  const onModalConfirm = () => {
    if (message === '물품이 등록 되었습니다.') {
      navigate('/');
    }
  };

  return (
    <>
      <Box as="form" onSubmit={handleSubmit} alignContent="center" w="1280px" maxWidth="container.xl" mt={66}>
        <Box borderBottom="1px" borderColor="#E2E8F0" pb={5}>
          <Text fontSize="3xl" fontWeight="bold">
            상품 정보
          </Text>
        </Box>
        <FormControl isRequired isInvalid={!passImage}>
          <Flex mt={14}>
            <FormLabel fontSize="xl" w={40}>
              상품 이미지
            </FormLabel>
            <Flex flexDirection="column">
              <Flex>
                <Button
                  w="220px"
                  h="220px"
                  border="2px"
                  borderColor="gray.200"
                  bgColor="color.gray"
                  textColor="color.gray_2"
                  _hover={{ bgColor: 'color.gray' }}
                  onClick={() => {
                    if (productImages.length < 5) {
                      //이미지가 3개 미만인 경우
                      fileInputRef.current.click();
                    } else {
                      alert('이미 5개의 이미지가 선택되었습니다.');
                    }
                  }}>
                  <Flex flexDirection="column" align="center">
                    <Image src="/images/camera.png" w={10} opacity={0.3} mb={3} />
                    이미지 등록
                  </Flex>
                </Button>
                <Stack direction="row" ml={3}>
                  {renderImages()}
                </Stack>
                <Input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleImageChange}
                  multiple
                  hidden
                  ref={fileInputRef}
                />
              </Flex>
              <Box d="block" color="color.blue" mt={6} fontSize="lg">
                최소 2개 이상의 이미지를 업로드한 후 이미지 검증 버튼을 눌러주세요.
              </Box>
              <Box d="block" fontSize="lg">
                {productImages.length}개의 이미지가 업로드되었습니다.
              </Box>
              <Flex align="center">
                <Button
                  mt={6}
                  w={28}
                  onClick={handleVerifyImages}
                  bgColor="color.blue"
                  _hover={{ bgColor: 'color.blue' }}
                  textColor="white">
                  이미지 검증
                </Button>
                {passImage ? (
                  <FormHelperText ml={6} mt={6} fontWeight="bold" fontSize="lg" color="color.blue">
                    이미지 검증이 완료되었습니다.
                  </FormHelperText>
                ) : (
                  <FormErrorMessage data-cy="check" ml={6} mt={6} fontWeight="bold" fontSize="lg" color="red">
                    {errorMessage}
                  </FormErrorMessage>
                )}
              </Flex>
            </Flex>
          </Flex>
        </FormControl>

        <ProductForm formSetting={formSetting} />

        <Box display="flex" justifyContent="flex-end" mt={8}>
          <Button
            data-cy="enroll-button"
            w={100}
            variant="unstyled"
            bgColor="color.blue"
            textColor="white"
            type="submit"
            isDisabled={!passImage}
            _hover={{ bgColor: 'color.blue' }}>
            등록하기
          </Button>
        </Box>

        <ConfirmationModal2
          isOpen={showModal}
          setShowModal={setShowModal}
          message={message}
          onConfirm={onModalConfirm} // 추가된 onConfirm prop
        />
      </Box>
    </>
  );
};

export default createProduct;
