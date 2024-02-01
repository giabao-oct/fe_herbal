import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Products from "../pages/Products";
import ProductDetail from "../pages/ProductDetail";
import Disease from "../pages/Disease";
import DiseaseDetail from "../pages/DiseaseDetail";
import News from "../pages/News";
import NewsDetail from "../pages/NewsDetail";
import About from "../pages/About";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import PurchaseHistory from "../pages/PurchaseHistory";

import AccountManagement from "../pages/AccountManagement";
import OrderManagement from "../pages/OrderManagement";
import DiseaseManagement from "../pages/DiseaseManagement";
import NewsManagement from "../pages/NewsManagement";

import AccountUpdate from "../pages/AccountUpdate";
import OrderDetail from "../pages/OrderDetail";

import ProductManagement from "../pages/ProductManagement";
import ProductUpdate from "../pages/ProductUpdate";
import ProductAdd from "../pages/ProductAdd";

import ReceiptManagement from "../pages/ReceiptManagement";
import ReceiptAdd from "../pages/ReceiptAdd";

import DiseaseUpdate from "../pages/DiseaseUpdate";
import DiseaseAdd from "../pages/DiseaseAdd";

import NewsUpdate from "../pages/NewsUpdate";
import NewsAdd from "../pages/NewsAdd";

import Profile from "../pages/Profile";
import ResetPassword from "../pages/ResetPassword";

export const routes = [
  {
    path: "/",
    page: Home,
  },
  {
    path: "/login",
    page: Login,
  },
  {
    path: "/register",
    page: Register,
  },
  {
    path: "/products",
    page: Products,
  },
  {
    path: "/product-management",
    page: ProductManagement,
  },
  {
    path: "/products/product-detail/:id",
    page: ProductDetail,
  },
  {
    path: "/product-management/product-update/:id",
    page: ProductUpdate,
  },
  {
    path: "/product-management/product-add",
    page: ProductAdd,
  },
  {
    path: "/receipt-management",
    page: ReceiptManagement,
  },
  {
    path: "/receipt-management/receipt-add",
    page: ReceiptAdd,
  },
  {
    path: "/disease",
    page: Disease,
  },
  {
    path: "/disease/disease-detail/:id",
    page: DiseaseDetail,
  },
  {
    path: "/disease-management",
    page: DiseaseManagement,
  },
  {
    path: "/disease-management/disease-update/:id",
    page: DiseaseUpdate,
  },
  {
    path: "/disease-management/disease-add",
    page: DiseaseAdd,
  },
  {
    path: "/news",
    page: News,
  },
  {
    path: "/news/news-detail/:id",
    page: NewsDetail,
  },
  {
    path: "/news-management",
    page: NewsManagement,
  },
  {
    path: "/news-management/news-update/:id",
    page: NewsUpdate,
  },
  {
    path: "/news-management/news-add",
    page: NewsAdd,
  },
  {
    path: "/about",
    page: About,
  },
  {
    path: "/checkout",
    page: Checkout,
  },
  {
    path: "/cart",
    page: Cart,
  },
  {
    path: "/purchase-history",
    page: PurchaseHistory,
  },
  {
    path: "/account-management",
    page: AccountManagement,
  },
  {
    path: "/account-management/account-update/:id",
    page: AccountUpdate,
  },
  {
    path: "/order-management",
    page: OrderManagement,
  },
  {
    path: "/order-management/order-detail/:id",
    page: OrderDetail,
  },

  {
    path: "/profile",
    page: Profile,
  },
  {
    path: "/reset-password",
    page: ResetPassword,
  },
];
