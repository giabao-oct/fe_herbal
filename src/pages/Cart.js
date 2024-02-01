import React, { useState, useEffect } from "react";
import baseURL from "../utils/httpRequest.js";
import { Helmet } from "react-helmet";
import axios from "axios";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import classnames from "classnames/bind";
import style from "../components/assets/styles/Cart.module.scss";
import GlobalStyles from "../components/assets/GlobalStyles";
import { Link } from "react-router-dom/cjs/react-router-dom";

const cx = classnames.bind(style);

export default function Cart() {
  const [soluong, setSoluong] = useState(0);
  const [cartInfo, setCartInfo] = useState(null);
  const [tongTien, setTongTien] = useState(0);
  const history = useHistory();
  const dispatch = useDispatch();
  const iduser = Cookies.get("id");
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseURL}get-cart-info/${iduser}`);
      setCartInfo(response.data.cart_info);
      setTongTien(response.data.tongtien);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const countProduct = async () => {
    try {
      const response = await axios.get(`${baseURL}count-product/${iduser}/`);
      dispatch({ type: "UPDATE_COUNT", payload: response.data.count });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDeleteProduct = async (idsp) => {
    try {
      await axios.delete(`${baseURL}delete-product-cart/${iduser}/${idsp}/`);
      fetchData();
      countProduct();
    } catch (error) {}
  };

  const handleIncrement = (idsp, currentQuantity) => {
    const newQuantity = currentQuantity + 1;
    setSoluong((prevQuantities) => ({
      ...prevQuantities,
      [idsp]: newQuantity,
    }));
    updateQuantity(idsp, newQuantity);
  };

  const handleDecrement = (idsp, currentQuantity) => {
    const newQuantity = Math.max(1, currentQuantity - 1);
    setSoluong((prevQuantities) => ({
      ...prevQuantities,
      [idsp]: newQuantity,
    }));
    updateQuantity(idsp, newQuantity);
  };

  const updateQuantity = async (idsp, newQuantity) => {
    try {
      await axios.post(`${baseURL}update-quantity/`, {
        iduser: iduser,
        idsp: idsp,
        quantity: newQuantity,
      });
      fetchData();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleCheckout = () => {
    if (cartInfo) {
      const checkQuantity = cartInfo.filter(
        (product) => product.soluong > product.SLton
      );

      if (checkQuantity.length > 0) {
        Swal.fire({
          icon: "info",
          title: "Thông báo",
          html: `Số lượng tồn của:</br><strong>${checkQuantity
            .map((product) => `</br>${product.tensp}: ${product.SLton}`)
            .join("\n")}</strong>`,
        });
      } else {
        history.push("/checkout");
      }
    }
  };

  const formatCurrency = (amount, locale = "vi-VN", currency = "VND") => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(amount);
  };

  if (!cartInfo || cartInfo.length === 0) {
    return (
      <div className={cx("notification")}>
        <div className={cx("notification-container")}>
          Chưa có sản phẩm nào trong giỏ hàng
        </div>
      </div>
    );
  }

  return (
    <GlobalStyles>
      <div>
        <Helmet>
          <title>Giỏ hàng</title>
        </Helmet>
      </div>
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <div className={cx("")}>
            <div className={cx("title")}>GIỎ HÀNG</div>
            <div className={cx("")}>
              <div className={cx("name-products")}>
                <div className={cx("col", "col-two")}> Sản phẩm</div>
                <div className={cx("col", "col-two")}>
                  <div className={cx("col", "col-four")}> Đơn giá</div>
                  <div className={cx("col", "col-four")}> Số lượng</div>
                  <div className={cx("col", "col-four")}> Số tiền</div>
                  <div className={cx("col", "col-four")}> Thao tác</div>
                </div>
                <div className={cx("clear")}></div>
              </div>
              <div className={cx("products")}>
                {cartInfo &&
                  cartInfo.map((product) => (
                    <div
                      key={product.idsp}
                      className={cx("card-product", "df-center")}
                    >
                      <div
                        className={cx(
                          "col",
                          "col-two",
                          "df-center",
                          "product-left"
                        )}
                      >
                        <Link
                          className={cx("col", "col-full", "df-center")}
                          to={`/products/product-detail/${product.idsp}`}
                        >
                          <div className={cx("col", "col-four")}>
                            <img
                              src={product.anhsp.split(",")[0]}
                              alt="product"
                            />
                          </div>
                          <div className={cx("col", "three-quarters")}>
                            {product.tensp}
                          </div>
                        </Link>
                      </div>
                      <div
                        className={cx(
                          "col",
                          "col-two",
                          "df-center",
                          "product-right"
                        )}
                      >
                        <div className={cx("col", "col-four", "df-center")}>
                          {formatCurrency(product.giaban)}
                        </div>
                        <div
                          className={cx(
                            "col",
                            "col-four",
                            "df-center",
                            "button"
                          )}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              handleDecrement(product.idsp, product.soluong)
                            }
                            className={cx("input-group-text")}
                          >
                            <i className="fa-solid fa-minus"></i>
                          </button>

                          <div className={cx("quantity")}>
                            {soluong[product.soluong] || product.soluong}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleIncrement(product.idsp, product.soluong)
                            }
                            className={cx("input-group-text")}
                          >
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                        <div className={cx("col", "col-four", "df-center")}>
                          {formatCurrency(product.giaban * product.soluong)}
                        </div>
                        <div className={cx("col", "col-four", "df-center")}>
                          <button
                            className={cx("bt-delete")}
                            onClick={() => handleDeleteProduct(product.idsp)}
                          >
                            Xoá
                          </button>
                        </div>
                      </div>
                      <div className={cx("clear")}></div>
                    </div>
                  ))}
              </div>
              <div className={cx("button-buy", "df-center")}>
                <div className={cx("total")}>
                  Tổng thanh toán: <span>{formatCurrency(tongTien)}</span>
                </div>

                <button onClick={handleCheckout}>Mua hàng</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlobalStyles>
  );
}
