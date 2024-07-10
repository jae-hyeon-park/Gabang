import {CookiesProvider} from "react-cookie";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Main from './pages/main/main';
import GetProductDetail from './pages/products/getProductDetail';
import GetProducts from './pages/products/getProducts';
import SigninForm from './pages/signin/SigninForm.jsx';
import DetailForm from './pages/signup/DetailForm.jsx';
import SignUpCompletePage from './pages/signup/SignupComplete.jsx';
import MyPage from './pages/myPage/MyPage.jsx';
import AdminPage from './pages/myPage/AdminPage.jsx';
import UserInfo from './pages/userInfo/UserInfo.jsx';
import FindId from './pages/findId/findId';
import FindPwd from './pages/findPwd/findPwd';
import FindPwd2 from './pages/findPwd/findPwd2';
import CreateProduct from './pages/products/createProduct.jsx';
import EditProduct from './pages/products/editProduct.jsx';
import ChangePwd from './pages/changePwd/changePwd';
import OrderForm from './pages/order/components/OrderForm.jsx';
import VerifyForm from './pages/signup/VerifyForm.jsx';
import FindId2 from './pages/findId/findId2.jsx';
import PrivateRoute from './components/common/PrivateRoute.jsx';
import ScrollToTop from "./ScrollToTop.jsx";

function App() {
  return (
    <BrowserRouter>
      <CookiesProvider>
        <Layout >
        <ScrollToTop />
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/products" element={<GetProducts />} />
            <Route path="/products/:Id" element={<GetProductDetail />} />
            <Route path="/signup/verify" element={<VerifyForm />} />
            <Route path="/signup/detail" element={<DetailForm />} />
            <Route path="/signup/complete" element={<SignUpCompletePage />} />
            <Route path="/help/id" element={<FindId />} />
            <Route path="/help/id2" element={<FindId2 />} />
            <Route path="/help/pw" element={<FindPwd />} />
            <Route path="/help/pw2" element={<FindPwd2 />} />
            <Route path="/signin" element={<SigninForm />} />
            <Route element={<PrivateRoute />}>
              <Route path="/product/regist" element={<CreateProduct />} />
              <Route path="/product/edit" element={<EditProduct />} />
              <Route path="/my/update/:Id" element={<UserInfo />} />
              <Route path="/my/update/pw" element={<ChangePwd />} />
              <Route path="/orders/order" element={<OrderForm />} />
              <Route path="admin/:Id" element={<AdminPage />} />
              <Route path="my/:Id" element={<MyPage />} />
            </Route>
          </Routes>
        </Layout>
      </CookiesProvider>
    </BrowserRouter>
  );
}

export default App;
