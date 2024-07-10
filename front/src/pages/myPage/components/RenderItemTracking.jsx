import { useState, useEffect } from 'react';
import { Text, useDisclosure } from '@chakra-ui/react';
import TrackingModal from '../../tracking/components/TrackingModal';
import ConfirmationModal2 from '../../../components/common/ConfirmationModal2';
import { getCookie } from '../../../utils/cookie';

const RenderItemTracking = ({ selectedMenu, product }) => {
  const { isOpen: isOpenTrackingModal, onOpen: onOpenTrackingModal, onClose: onCloseTrackingModal } = useDisclosure();
  const [companyList, setCompanyList] = useState([]);
  const [selectedCourier, setSelectedCourier] = useState(product.deliveryCompany || '');
  const [trackingNumber, setTrackingNumber] = useState(product.invoiceNumber || '');
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('등록된 송장번호가 없습니다.');

  const productId = product.productId;

  const getDeliveryInfo = (productId) => {
    fetch(`/api/delivery?productId=${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getCookie('token'),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSelectedCourier(data.deliverycompany);
        setTrackingNumber(data.invoicenumber);
      })
      .catch((error) => {
        console.error('fetch error about my report');
      });
  };

  useEffect(() => {
    if (isOpenTrackingModal) {
      getDeliveryInfo(productId);
    }
  }, [isOpenTrackingModal, productId]);

  const postDeliveryInfo = async () => {
    const deliveryInfo = {
      productId,
      trackingNumber,
      selectedCourier,
    };

    const response = await fetch('/api/delivery', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getCookie('token'),
      },
      body: JSON.stringify({ productId, invoicenumber: trackingNumber, deliverycompany: selectedCourier }),
    });

    if (response.ok) {
      handleInputComplete();
    } else {
      console.log('error');
    }
  };

  const handleInputComplete = () => {
    onCloseTrackingModal(); // 모달 닫기
  };

  const apiKey = '259FUCNmEtVI574XjbVukw';

  useEffect(() => {
    const fetchCompanyList = async () => {
      const metaTag = document.createElement('meta');
      metaTag.setAttribute('http-equiv', 'Content-Security-Policy');
      metaTag.setAttribute('content', 'upgrade-insecure-requests');
      document.head.appendChild(metaTag);
      try {
        const response = await fetch(`http://info.sweettracker.co.kr/api/v1/companylist?t_key=${apiKey}`);
        const data = await response.json();
        setCompanyList(data.Company);
      } catch (error) {
        console.error('Error:', error);
      }
      return () => {
        document.head.removeChild(metaTag);
      };
    };

    fetchCompanyList();
  }, []);

  const clickTrackingButton = () => {
    const form = document.getElementById('trackingForm');
    document.getElementsByName('t_code')[0].value = product.deliverycompany;
    document.getElementsByName('t_invoice')[0].value = product.invoicenumber;
    if (form) {
      const windowWidth = 500;
      const windowHeight = 500;
      const windowLeft = window.screen.width / 2 - windowWidth / 2;
      const windowTop = window.screen.height / 2 - windowHeight / 2;
      const trackingWindow = window.open(
        '_blank',
        'trackingWindow',
        `width=${windowWidth},height=${windowHeight},left=${windowLeft},top=${windowTop}`,
      );
      if (trackingWindow) {
        form.target = 'trackingWindow';
        form.submit();
      } else {
        alert('팝업 차단을 해제해주세요.');
      }
    }
  };

  if (selectedMenu === '판매 내역' && product.tradeWay !== 'G' && product.tradeState === '2') {
    return (
      <>
        <Text
          onClick={onOpenTrackingModal}
          cursor="pointer"
          textDecoration="underline"
          _hover={{ color: 'color.blue' }}>
          송장번호 입력
        </Text>
        <TrackingModal
          isOpen={isOpenTrackingModal}
          onClose={onCloseTrackingModal}
          companyList={companyList}
          selectedCourier={selectedCourier}
          setSelectedCourier={setSelectedCourier}
          trackingNumber={trackingNumber}
          setTrackingNumber={setTrackingNumber}
          handleInputComplete={handleInputComplete}
          product={product}
          postDeliveryInfo={postDeliveryInfo}
        />
      </>
    );
  } else if (selectedMenu === '구매 내역' && product.tradeWay !== 'G') {
    return (
      <>
        <form
          id="trackingForm"
          action="http://info.sweettracker.co.kr/tracking/1"
          method="post"
          style={{ display: 'none' }}>
          <input type="text" name="t_key" value={apiKey} readOnly />
          <input type="text" name="t_code" value={product.deliverycompany} readOnly />
          <input type="text" name="t_invoice" value={product.invoicenumber} readOnly />
        </form>
        <Text
          onClick={product.deliverycompany !== null & product.invoicenumber !== null ?
                  clickTrackingButton
                  :
                  () => setShowModal(true)}
          cursor="pointer"
          textDecoration="underline"
          _hover={{ color: 'color.blue' }}>
          배송조회
        </Text>
        <ConfirmationModal2
          isOpen={showModal}
          setShowModal={setShowModal}
          message={message}
          onConfirm={() => setShowModal(false)}
        />
      </>
    );
  }
  return null; // 직거래일 경우
};

export default RenderItemTracking;
