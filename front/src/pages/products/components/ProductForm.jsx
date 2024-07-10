import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Flex,
  Text,
  Select,
  Textarea,
  Stack,
  InputGroup,
  InputRightElement,
  CheckboxGroup,
  Checkbox,
} from '@chakra-ui/react';

import categories from './category';

const ProductForm = ({ formSetting }) => {
  const handleCheckboxChange = (values) => {
    formSetting.setCheckedTransactionMethod(values);
  };

  const handlePriceChange = (e) => {
    let value = e.target.value;
    // 입력값이 비어있거나 숫자가 아닐 때 빈 문자열로 설정
    if (value === '' || isNaN(value)) {
      formSetting.setPrice('');
    } else {
      // 숫자 입력의 경우 최대값 제한 적용
      value = Math.max(0, Math.min(100000000, Number(value)));
      formSetting.setPrice(value.toString());
    }
  };

  const isDeliverySelected = formSetting.checkedItems.includes('delivery');

  return (
    <Box mt={50}>
      <FormControl isRequired mt={14}>
        <Flex>
          <FormLabel fontSize="xl" w={40}>
            상품명
          </FormLabel>
          <Flex>
            <InputGroup>
              <Input
                name="productName"
                value={formSetting.productName}
                onChange={(e) => formSetting.setProductName(e.target.value)}
                maxLength={40}
              />

              <InputRightElement pointerEvents="none">
                <Box textAlign="right" mr={5} textColor="color.gray_1">
                  {formSetting.productName.length}/40
                </Box>
              </InputRightElement>
            </InputGroup>
          </Flex>
        </Flex>
      </FormControl>

      <FormControl isRequired mt={14}>
        <Flex>
          <FormLabel fontSize="xl" w={40}>
            카테고리
          </FormLabel>
          <Select
            name="category"
            w="268px"
            placeholder="카테고리를 선택해주세요."
            value={formSetting.category}
            onChange={(e) => formSetting.setCategory(e.target.value)}>
            {Object.entries(categories)
              .slice(1)
              .map(([key, value]) => (
                <option key={value} value={value}>
                  {key}
                </option>
              ))}
          </Select>
        </Flex>
      </FormControl>

      <FormControl isRequired mt={14}>
        <Flex>
          <FormLabel fontSize="xl" w={40}>
            설명
          </FormLabel>
          <Textarea
            name="description"
            w="85%"
            placeholder={`상품 브랜드, 모델명, 구매 시기 등 최대한 자세히 설명해주세요.\u000A전화번호 등 개인정보는 입력이 제한될 수 있습니다.`}
            resize="none"
            value={formSetting.description}
            onChange={(e) => formSetting.setDescription(e.target.value)}
            maxLength={2000}
            minH="150px"
          />
          <Box position="absolute" right="10" bottom="2" textColor="color.gray_1">
            {formSetting.description.length}/2000
          </Box>
        </Flex>
      </FormControl>

      <Box borderBottom="1px" borderColor="#E2E8F0" pb={5} mt={24}>
        <Text fontSize="3xl" fontWeight="bold">
          가격 및 배송정보
        </Text>
      </Box>

      <FormControl isRequired mt={14}>
        <Flex>
          <FormLabel fontSize="xl" w={40}>
            가격
          </FormLabel>
          <Flex>
            <InputGroup>
              <Input name='price' type="number" value={formSetting.price} max={100000000} onChange={handlePriceChange} />
              <InputRightElement pointerEvents="none">
                <Box as="span" my={2} ml={2} textColor="color.gray_1">
                  원
                </Box>
              </InputRightElement>
            </InputGroup>
          </Flex>
        </Flex>
      </FormControl>

      <FormControl as="fieldset" mt={14}>
        <Flex>
          <FormLabel fontSize="xl" as="legend" w={40} display="flex">
            거래 유형 <Text color="red.500">&nbsp;*</Text>
          </FormLabel>
          <CheckboxGroup colorScheme="green" onChange={handleCheckboxChange} value={formSetting.checkedItems}>
            <Stack direction="row">
              <Checkbox
                data-cy="direct-checkbox"
                value="direct"
                mr={5}
                sx={{
                  '.chakra-checkbox__label': { fontSize: 'lg' },
                }}>
                직거래
              </Checkbox>
              <Checkbox
                data-cy="delivery-checkbox"
                value="delivery"
                sx={{
                  '.chakra-checkbox__label': { fontSize: 'lg' },
                }}>
                택배거래
              </Checkbox>
            </Stack>
          </CheckboxGroup>
        </Flex>
      </FormControl>

      {isDeliverySelected && (
        <FormControl isRequired mt={14}>
          <Flex>
            <FormLabel fontSize="xl" w={40}>
              배송비
            </FormLabel>
            <Select
              w="268px"
              placeholder="배송비 여부를 선택해주세요"
              value={formSetting.includeDeliveryFee}
              onChange={(e) => formSetting.setIncludeDeliveryFee(e.target.value)}>
              <option value="Y">배송비 포함</option>
              <option value="N">배송비 별도</option>
            </Select>
          </Flex>
        </FormControl>
      )}

      <FormControl isRequired mt={14}>
        <Flex>
          <FormLabel fontSize="xl" w={40}>
            거래 장소
          </FormLabel>
          <Input
            name="transactionPlace"
            w="268px"
            value={formSetting.transactionPlace}
            onChange={(e) => formSetting.setTransactionPlace(e.target.value)}
          />
        </Flex>
      </FormControl>
    </Box>
  );
};

export default ProductForm;
