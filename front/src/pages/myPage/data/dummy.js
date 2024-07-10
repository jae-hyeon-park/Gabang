import { getPayload, isCookie } from "../../../utils/cookie";

export const myData = {
  userId: isCookie("token")? getPayload("token").userId : 'user11',
  nickname: isCookie("token")? getPayload("token").userName : '성실하게',
  role: 'user',
  isInsurance: false,
  sell: [
    {
      name: '맥북 에어',
      price: 1000000,
      state: '판매중',
      img: './public/images/airpot.png',
      productNumber: '12345',
      date: '2024-03-30',
    },
    {
      name: '에어팟',
      price: 50000,
      state: '판매중',
      img: './public/images/airpot.png',
      productNumber: '12345',
      date: '2024-03-30',
    },
    {
      name: '갤럭시북',
      price: 1000000,
      state: '예약중',
      img: './public/images/airpot.png',
      productNumber: '12345',
      date: '2024-03-30',
    },
    {
      name: '버즈 프로',
      price: 50000,
      state: '예약중',
      img: './public/images/airpot.png',
      productNumber: '12345',
      date: '2024-03-30',
    },
    {
      name: '2024 정처기 실기 책',
      price: 10000,
      state: '판매완료',
      img: './public/images/airpot.png',
      productNumber: '12345',
      date: '2024-03-30',
    },
    {
      name: '2024 정처기 필기 책',
      price: 8000,
      state: '판매완료',
      img: './public/images/airpot.png',
      productNumber: '12345',
      date: '2024-03-30',
    },
  ],
  buy: [
    {
      name: 'LG 그램',
      price: 1400000,
      state: '배송중',
      img: './public/images/airpot.png',
      productNumber: '12345',
      date: '2024-03-30',
    },
    {
      name: 'SQLD 문제집',
      price: 7000,
      state: '배송중',
      img: './public/images/airpot.png',
      productNumber: '12345',
      date: '2024-03-30',
    },
    {
      name: '키보드',
      price: 80000,
      state: '구매확정',
      img: './public/images/airpot.png',
      productNumber: '12345',
      date: '2024-03-30',
    },
    {
      name: '보조 배터리',
      price: 2000,
      state: '구매확정',
      img: './public/images/airpot.png',
      productNumber: '12345',
      date: '2024-03-30',
    },
  ],
  report: [
    { title: '허위매물 의심', content: '허위매물 의심됩니다.', name: 'guguttemy', date: '2024-03-30' },
    { title: '광고글', content: '광고글 의심됩니다.', name: 'guguttemy', date: '2024-04-01' },
  ],
};

export const users = [
  { nickname: '성실하게', date: '2024-03-30', role: 'admin' },
  { nickname: 'user_1', date: '2024-04-01', role: 'user' },
  { nickname: 'user_2', date: '2024-04-02', role: 'user' },
  { nickname: 'user_3', date: '2024-04-03', role: 'user' },
];

export const reports = [
  { title: '신고_1', content: '신고합니다.', writer: '성실하게', date: '2024-03-30' },
  { title: '신고_2', content: '신고합니다.', writer: 'user_1', date: '2024-04-01' },
  { title: '신고_3', content: '신고합니다.', writer: 'user_2', date: '2024-04-02' },
  { title: '신고_4', content: '신고합니다.', writer: 'user_3', date: '2024-04-03' },
];
