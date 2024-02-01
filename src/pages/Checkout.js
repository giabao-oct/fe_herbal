import React, { useState, useEffect } from "react";
import baseURL from "../utils/httpRequest.js";
import { Helmet } from "react-helmet";
import { useHistory, useParams, useLocation, Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import classnames from "classnames/bind";
import style from "../components/assets/styles/Checkout.module.scss";
import GlobalStyles from "../components/assets/GlobalStyles";

const cx = classnames.bind(style);

export default function Cart() {
  const [soluong, setSoluong] = useState(0);
  const [checkout, setCheckout] = useState(null);
  const [tongTien, setTongTien] = useState(0);
  const [acc, setAcc] = useState("");
  const location = useLocation();
  const [giaban, setGiaban] = useState(0);
  const dispatch = useDispatch();
  const history = useHistory();
  const searchParams = new URLSearchParams(location.search);
  const idsp = searchParams.get("product");
  const quantity = searchParams.get("quantity");
  const iduser = Cookies.get("id");
  //lấy giá bán từ mảng, ? tránh lỗi không tồn tại

  useEffect(() => {
    if (idsp && quantity) {
      axios
        .get(`${baseURL}product-checkout/${idsp}/`)
        .then((response) => {
          setCheckout(response.data);
          setSoluong(quantity);
          setGiaban(response.data[0]?.giaban);
        })
        .catch((error) => {
          console.error("Lỗi khi tải dữ liệu từ API:", error);
        });
    } else {
      fetchData();
    }

    Account();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseURL}get-cart-info/${iduser}`);
      setCheckout(response.data.cart_info);
      setTongTien(response.data.tongtien);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const Account = async () => {
    try {
      const response = await fetch(`${baseURL}account-detail/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ iduser }),
      });

      const data = await response.json();
      setAcc(data);
    } catch (error) {
      console.error("Error fetching account details:", error);
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

  const handleCheckout = async () => {
    try {
      const response = await axios.post(`${baseURL}generate-otp/`, {
        iduser: iduser,
      });

      const { value: OTP } = await Swal.fire({
        title: "OTP",
        input: "text",
        inputPlaceholder: "Nhập mã OTP",
        allowOutsideClick: false,
        showCloseButton: true,
        footer: "Vui lòng truy cập vào email để lấy OTP",
        didOpen: () => {
          const input = Swal.getInput();
          if (input) {
            input.addEventListener("input", function () {
              const inputValue = input.value;
              input.value = inputValue.replace(/\D/g, "");
            });
            input.addEventListener("keydown", function (e) {
              if (e.key !== "Backspace" && !/^\d$/.test(e.key) && !e.ctrlKey) {
                e.preventDefault();
              }
            });
          }
        },
        customClass: {
          container: "swal-container-OTP",
          title: "swal-title-OTP",
          closeButton: cx("swal-close-button"),
          icon: "my-swal-icon",
          image: "my-swal-image",
          content: "my-swal-content",
          input: cx("swal-input-OTP"),
          confirmButton: cx("swal-confirm-OTP"),
          footer: cx("swal-footer-OTP"),
        },
      });

      if (idsp && quantity) {
        if (OTP) {
          try {
            const response = await axios.post(`${baseURL}verify-otp-product/`, {
              iduser: iduser,
              idsp: idsp,
              soluong: quantity,
              otp: OTP,
            });

            Swal.fire({
              icon: "success",
              title: "Thành công",
              text: "Đặt hàng thành công",
            }).then((result) => {
              if (result.isConfirmed) {
                history.push("/products");
              }
            });
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "Thất bại",
              text: "OTP đã hết hạn hoặc không chính xác",
            });
          }
        }
      } else {
        if (OTP) {
          try {
            const response = await axios.post(`${baseURL}verify-otp/`, {
              iduser: iduser,
              otp: OTP,
            });

            Swal.fire({
              icon: "success",
              title: "Thành công",
              text: "Đặt hàng thành công",
            }).then((result) => {
              if (result.isConfirmed) {
                history.push("/products");
              }
            });
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "Thất bại",
              text: "OTP đã hết hạn hoặc không chính xác",
            });
          }
        }
      }
      countProduct();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Đã xảy ra lỗi khi gửi yêu cầu API. Vui lòng thử lại.",
      });
    }
  };

  const formatCurrency = (amount, locale = "vi-VN", currency = "VND") => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(amount);
  };

  return (
    <GlobalStyles>
      <div>
        <Helmet>
          <title>Thanh toán</title>
        </Helmet>
      </div>
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <div className={cx("")}>
            <div className={cx("title")}>THANH TOÁN</div>
            <div className={cx("")}>
              <div className={cx("line")}></div>
              <div className={cx("cust-inf")}>
                <div className={cx("container-cust-inf")}>
                  <div className={cx("address")}>
                    <i class="fa-solid fa-location-dot"></i>
                    <span>Địa chỉ nhận hàng</span>
                  </div>
                  <span>
                    {acc.tendn} ({acc.sdt})
                  </span>
                  {acc.diachi}
                  <Link to={`/profile`}>Thay đổi</Link>
                </div>
              </div>

              <div className={cx("container-products")}>
                <div className={cx("name-products")}>
                  <div className={cx("col", "col-two")}> Sản phẩm</div>
                  <div className={cx("col", "col-two")}>
                    <div className={cx("col", "col-three")}> Đơn giá</div>
                    <div className={cx("col", "col-three")}> Số lượng</div>
                    <div className={cx("col", "col-three")}> Số tiền</div>
                  </div>
                  <div className={cx("clear")}></div>
                </div>
                <div className={cx("products")}>
                  {checkout &&
                    checkout.map((product) => (
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
                          <div className={cx("col", "col-three", "df-center")}>
                            {formatCurrency(product.giaban)}
                          </div>
                          <div
                            className={cx(
                              "col",
                              "col-three",
                              "df-center",
                              "button"
                            )}
                          >
                            <div className={cx("quantity")}>
                              {
                                // soluong[product.soluong] ||
                                product.soluong || soluong
                              }
                            </div>
                          </div>
                          <div className={cx("col", "col-three", "df-center")}>
                            {formatCurrency(
                              product.giaban * product.soluong ||
                                product.giaban * soluong
                            )}
                          </div>
                        </div>
                        <div className={cx("clear")}></div>
                      </div>
                    ))}
                </div>
              </div>
              <div className={cx("button-buy", "df-center")}>
                <div className={cx("total")}>
                  Tổng thanh toán:{" "}
                  <span>{formatCurrency(tongTien || giaban * soluong)}</span>
                </div>
                <button onClick={handleCheckout}>Đặt hàng</button>
              </div>
              <div className={cx("clear")}></div>
            </div>
          </div>
        </div>
      </div>
    </GlobalStyles>
  );
}
