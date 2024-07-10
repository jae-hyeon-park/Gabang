import { Badge } from '@chakra-ui/react';

const RenderItemState = ({ selectedMenu, product }) => {
  let tradeWay;
  switch (product.tradeWay) {
    case 'A':
      tradeWay = '직거래/택배거래';
      break;
    case 'G':
      tradeWay = '직거래';
      break;
    case 'T':
      tradeWay = '택배거래';
      break;
  }

  if (selectedMenu === '판매 내역') {
    return <>{tradeWay}</>;
  } else if (selectedMenu === '구매 내역') {
    return <Badge>{product.tradeState === '1' ? '배송중' : '구매확정'}</Badge>;
  }
};

export default RenderItemState;
