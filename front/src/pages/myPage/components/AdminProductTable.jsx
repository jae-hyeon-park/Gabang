import {TableContainer, Table, Thead, Tbody, Th, Tr, Td, Flex, Button, Image} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import { getCookie } from '../../../utils/cookie';

const AdminProductTable = ({ products }) => {
  const [showModal, setShowModal] = useState(false);
  const [isCancelButton, setIsCancelButton] = useState(true);
  const [message, setMessage] = useState('삭제 하시겠습니까?');
  const [selectedProduct, setSelectedProduct] = useState('');

  const navigate = useNavigate();

  const handleNavigate = (product) => {
    navigate(`/product/edit`, {
      state: {
        productId: product.productId,
        productPrice: product.productPrice,
        productTitle: product.productName,
        productExplain: product.productExplain,
        tradeWay: product.tradeWay,
        tradeLocation: product.tradeLocation,
        ynDeliveryfee: product.ynDeliveryfee,
        categoryName: product.categoryName,
        imageURLs: product.imageURLs
      }
    }), window.scrollTo(0, 0);
  };

  const openModal = (product) => {
    setIsCancelButton(true);
    setMessage('삭제 하시겠습니까?');
    setSelectedProduct(product.productId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const deleteProduct = (productId) => {
    fetch(`/api/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getCookie('token')
      }
    })
    .then((response) => response.text())
    .then((data) => {
      setMessage(data);
    })
    .catch((error) => {
      console.error('fetch error at UserItemsTable');
    });
    setIsCancelButton(false);
  };

  const renderEmptyBody = () => {
    return (
      <Tr>
        <Td colSpan={6} textAlign="center">검색 결과가 없습니다.</Td>
      </Tr>
    );
  };

  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th textAlign='center'>상품명</Th>
            <Th textAlign='center'>가격</Th>
            <Th textAlign='center'>상품번호</Th>
            <Th textAlign='center'>등록일</Th>
            <Th textAlign='center'>주문상태</Th>
            <Th textAlign='center'>수정/삭제</Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.length === 0 ? renderEmptyBody() : products.map((product, index) => (
            <Tr key={index}>
              <Td>
                <Flex alignItems="center">
                  <Image src={product.imgUrl} boxSize='50px' mr={4} />
                  {product.productName}
                </Flex>
              </Td>
              <Td textAlign='center'>{product.productPrice.toLocaleString()}원</Td>
              <Td textAlign='center'>{product.productId}</Td>
              <Td textAlign='center'>{product.registrationDate.split('T')[0]}</Td>
              <Td textAlign='center'>{(product.tradeState === '1') ? '판매중' : (product.tradeState === '2') ? '예약중' : '판매완료'}</Td>
              <Td textAlign='center'>
                <Button size='xs' mr='2%' onClick={() => handleNavigate(product)}>수정</Button>
                <Button size='xs' ml='2%' onClick={() => openModal(product)}>삭제</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <ConfirmationModal
        isOpen={showModal}
        onConfirm={
          message === '구매확정 하시겠습니까?' ? () => completeTrade(selectedTrade, selectedProduct) : message === '삭제 하시겠습니까?' ? () => deleteProduct(selectedProduct) : closeModal
        }
        onCancel={closeModal}
        message={message}
        isCancelButtion={isCancelButton}
        isConfirmButton={true}
      />
    </TableContainer>
  );
};

export default AdminProductTable;