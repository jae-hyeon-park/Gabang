import { TableContainer, Table, Thead, Tbody, Th, Tr, Td, Flex, Image, Button, Skeleton } from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RenderItemState from './RenderItemState';
import RenderItemTracking from './RenderItemTracking';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import { getCookie } from '../../../utils/cookie';

const UserItemsTable = ({ products, selectedMenu, page, userId, selectedTab, getSalesProducts, getPurchasedProduct, isLoading }) => {
  const [showModal, setShowModal] = useState(false);
  const [isCancelButton, setIsCancelButton] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedTrade, setSelectedTrade] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');

  let content = null;

  const navigate = useNavigate();

  const handleUpdateNavigate = (product) => {
    navigate(`/product/edit`, {
      state: {
        productId: product.productId,
        productPrice: product.productPrice,
        productTitle: product.productName,
        productExplain: product.productExplain,
        tradeWay: product.tradeWay,
        tradeLocation: product.tradeLocation,
        ynDeliveryfee: product.ynDeliveryfee,
        categoryId: product.categoryId,
        imageURLs: product.imageURLs,
      },
    }),
      window.scrollTo(0, 0);
  };

  const handleDetailNavigate = (productId) => {
    navigate(`/products/${productId}`);
    window.scrollTo(0, 0);
  };

  const openModal = (product) => {
    setIsCancelButton(true);
    if (selectedMenu === '판매 내역') {
      setMessage('삭제 하시겠습니까?');
    } else if (selectedMenu === '구매 내역') {
      setMessage('구매확정 하시겠습니까?');
    }
    setSelectedTrade(product.tradeId);
    setSelectedProduct(product.productId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const saleHeaders = [
    { label: '상품명', width: '40%' },
    { label: '가격', width: '15%' },
    { label: '거래유형', width: '15%' },
    { label: '배송', width: '15%' },
    { label: '수정/삭제', width: '15%' },
  ];

  const purchaseHeaders = [
    { label: '상품명', width: '40%' },
    { label: '가격', width: '15%' },
    { label: '거래유형', width: '15%' },
    { label: '배송조회', width: '15%' },
    { label: '구매확정', width: '15%' },
  ];

  const renderHeaders = (headers) => {
    return headers.map((header, index) => (
      <Th key={index} textAlign="center" fontSize="lg" sx={{ width: header.width }} scope="col">
        {header.label}
      </Th>
    ));
  };

  const renderEmptyBody = () => {
    return (
      <Tr>
        <Td colSpan={5} textAlign="center">
          검색 결과가 없습니다.
        </Td>
      </Tr>
    );
  };

  const renderSkeleton = () => {
    return (
      <>
        <Tr>
          <Td colSpan={5}>
            <Skeleton height='30px' startColor='#f0f0f0' endColor='#e0e0e0' speed={0.8} />
          </Td>
        </Tr>
        <Tr>
          <Td colSpan={5}>
            <Skeleton height='30px' startColor='#f0f0f0' endColor='#e0e0e0' speed={0.8} />
          </Td>
        </Tr>
        <Tr>
          <Td colSpan={5}>
            <Skeleton height='30px' startColor='#f0f0f0' endColor='#e0e0e0' speed={0.8} />
          </Td>
        </Tr>
      </>
    );
  }

  const renderSaleBody = () => {
    return products.map((product, index) => (
      <Tr key={index}>
        <Td>
          <Flex alignItems="center" cursor="pointer" onClick={() => handleDetailNavigate(product.productId)}>
            <Image src={product.imageURLs[0]} boxSize="50px" mr={4} alt='상품 이미지' />
            {product.productName}
          </Flex>
        </Td>
        <Td textAlign="center">{product.productPrice.toLocaleString()}원</Td>
        <Td textAlign="center">
          <RenderItemState selectedMenu={selectedMenu} product={product} />
        </Td>
        <Td textAlign="center">
          <RenderItemTracking selectedMenu={selectedMenu} product={product} />
        </Td>
        <Td textAlign="center">
          {product.tradeState === '1' && (
            <>
              <Button bgColor="white" _hover={{ color: 'color.blue' }} onClick={() => handleUpdateNavigate(product)}>
                <EditIcon />
              </Button>
              <Button bgColor="white" _hover={{ color: 'color.blue' }} onClick={() => openModal(product)}>
                <DeleteIcon />
              </Button>
            </>
          )}
        </Td>
      </Tr>
    ));
  };

  const renderPurchaseBody = () => {
    return products.map((product, index) => (
      <Tr key={index}>
        <Td>
          <Flex alignItems="center" cursor="pointer" onClick={() => handleDetailNavigate(product.productId)}>
            <Image src={product.imageURLs[0]} boxSize="50px" mr={4} alt='상품 이미지' />
            {product.productName}
          </Flex>
        </Td>
        <Td textAlign="center">{product.productPrice.toLocaleString()}원</Td>
        <Td textAlign="center">
          {product.tradeWay === 'A' ? '직거래/택배거래' : product.tradeWay === 'T' ? '택배거래' : '직거래'}
        </Td>
        <Td textAlign="center">
          <RenderItemTracking selectedMenu={selectedMenu} product={product} />
        </Td>
        <Td textAlign="center">
          <Button
            size="xs"
            onClick={() => openModal(product)}
            bgColor={product.transactionCompletionTime === null ? 'color.blue' : '#505050'}
            isDisabled={product.transactionCompletionTime === null ? false : true}
            color="white"
            _hover={'none'}>
            구매확정
          </Button>
        </Td>
      </Tr>
    ));
  };

  const completeTrade = (tradeId, productId) => {
    setSelectedTrade(tradeId);
    const time = new Date(new Date().getTime() + 9 * 60 * 60 * 1000).toISOString();
    const data = {
      time: time,
      productId: productId,
    };

    fetch(`/api/trade/${tradeId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getCookie('token'),
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.text())
      .then((data) => {
        setMessage(data);
      })
      .catch((error) => {
        console.error('fetch error at completeTrade');
      });
    setIsCancelButton(false);
    if (selectedTab === 0) {
      getPurchasedProduct(page, userId, 'null', 'all');
    } else {
      getPurchasedProduct(page, userId, 'null', 'before');
    }
    
  };

  const deleteProduct = (productId) => {
    fetch(`/api/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getCookie('token'),
      },
    })
      .then((response) => response.text())
      .then((data) => {
        setMessage(data);
      })
      .catch((error) => {
        console.error('fetch error at UserItemsTable');
      });
    setIsCancelButton(false);
    getSalesProducts(page, userId, 'null', selectedTab.toString());
  };

  if (isLoading) {
    content = renderSkeleton();
  } else {
    if (products.length === 0) {
      content = renderEmptyBody();
    } else {
      if (selectedMenu === '판매 내역') {
        content = renderSaleBody();
      } else {
        content = renderPurchaseBody();
      }
    }
  }

  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>{selectedMenu === '판매 내역' ? renderHeaders(saleHeaders) : renderHeaders(purchaseHeaders)}</Tr>
        </Thead>
        <Tbody>
          {content}
        </Tbody>
      </Table>
      <ConfirmationModal
        isOpen={showModal}
        onConfirm={
          message === '구매확정 하시겠습니까?'
            ? () => completeTrade(selectedTrade, selectedProduct)
            : message === '삭제 하시겠습니까?'
              ? () => deleteProduct(selectedProduct)
              : closeModal
        }
        onCancel={closeModal}
        message={message}
        isCancelButtion={isCancelButton}
        isConfirmButton={true}
      />
    </TableContainer>
  );
};

export default UserItemsTable;
