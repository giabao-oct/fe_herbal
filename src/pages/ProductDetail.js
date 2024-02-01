import React, { useState, useEffect } from "react";
import baseURL from "../utils/httpRequest.js";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import classnames from "classnames/bind";
import style from "../components/assets/styles/ProductDetail.module.scss";
import GlobalStyles from "../components/assets/GlobalStyles";

import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Cookies from "js-cookie";

const cx = classnames.bind(style);

export default function ProductDetail() {
  const [products, setProduct] = useState([]);
  const [previewImageIndex, setPreviewImageIndex] = useState(0);
  const [soluong, setSoluong] = useState(1);
  const [loggedIn, setLoggedIn] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const currentUrl = window.location.href;
  const regex = /\/(\d+)$/;
  const match = currentUrl.match(regex);
  const idsp = match ? match[1] : null;
  const iduser = Cookies.get("id");
  const role = Cookies.get("role");

  useEffect(() => {
    if ((iduser, role === "user")) {
      setLoggedIn(true);
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`${baseURL}product-detail/${idsp}/`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchData();
  }, [idsp]);

  if (!products || !products.anhsp) {
    return (
      <div className={cx("notification")}>
        <div className={cx("notification-container")}>
          Không có dữ liệu sản phẩm
        </div>
      </div>
    );
  }

  const renderImages = () => {
    return products.anhsp.split(",").map((imageUrl, index) => (
      <SwiperSlide key={index}>
        <div
          className={cx("container-thumbnail")}
          onClick={() => setPreviewImageIndex(index)}
        >
          <img
            className={cx("thumbnail-img", {
              "active-thumbnail": index === previewImageIndex,
            })}
            src={imageUrl.trim()}
            alt={`Thumbnail ${index + 1}`}
          />
        </div>
      </SwiperSlide>
    ));
  };

  const countProduct = async () => {
    try {
      const response = await axios.get(`${baseURL}count-product/${iduser}/`);
      dispatch({ type: "UPDATE_COUNT", payload: response.data.count });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddToCart = (slton) => {
    if (loggedIn) {
      if (slton === 0) {
        Swal.fire({
          icon: "warning",
          title: "Thông báo",
          text: "Sản phẩm đã hết",
        });
      } else {
        const data = { iduser, idsp, soluong };
        axios
          .post(`${baseURL}add-to-cart/`, data)
          .then((response) => {
            Swal.fire({
              icon: "success",
              title: "Thành công",
              text: "Sản phẩm đã được thêm vào giỏ hàng",
            }).then((result) => {
              if (result.isConfirmed) {
                countProduct();
              }
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: "warning",
              title: "Cảnh báo",
              text: "Thêm sản phẩm vào giỏ hàng thất bại!",
            });
          });
      }
    } else {
      Swal.fire({
        icon: "info",
        title: "Thông báo",
        text: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          history.push("/login");
        }
      });
    }
  };

  const handleBuyClick = (slton) => {
    if (loggedIn) {
      if (slton === 0) {
        Swal.fire({
          icon: "warning",
          title: "Thông báo",
          text: "Sản phẩm đã hết",
        });
      } else {
        history.push(`/checkout?product=${idsp}&quantity=${soluong}`);
      }
    } else {
      Swal.fire({
        icon: "info",
        title: "Thông báo",
        text: "Vui lòng đăng nhập để mua hàng!",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          history.push("/login");
        }
      });
    }
  };

  const handleIncrement = () => {
    if (products.SLton > soluong) {
      setSoluong((prevCount) => prevCount + 1);
    } else setSoluong(products.SLton);
  };
  const handleDecrement = () => {
    if (soluong > 1) {
      setSoluong((prevCount) => prevCount - 1);
    }
  };

  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(products.giaban);

  return (
    <GlobalStyles>
      <div>
        <Helmet>
          <title>Chi tiết sản phẩm</title>
        </Helmet>
      </div>
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <div className={cx("container-name")}>
            <div className={cx("left-container", "col", "sixty-percent ")}>
              <div className={cx("preview-overlay")}>
                <div className={cx("preview-container")}>
                  <img
                    className={cx("preview-img")}
                    src={products.anhsp.split(",")[previewImageIndex].trim()}
                    alt={`Preview ${previewImageIndex + 1}`}
                  />
                </div>
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={5}
                  loop={true}
                  pagination={{ clickable: true }}
                  navigation={true}
                  className={cx("mySwiper")}
                  slidesPerView={3}
                >
                  {renderImages()}
                </Swiper>
              </div>
            </div>

            <div className={cx("right-container", "col", "forty-percent")}>
              <label className={cx("title-name")}>{products.tensp}</label>
              <p>
                <strong>Tên khác: </strong>
                {products.tenkhac}
              </p>
              <p>
                <strong>Tên khoa học: </strong>
                {products.tenkhoahoc}
              </p>
              <p>
                <strong>Công dụng: </strong>
                {products.congdung}
              </p>
              <div className={cx("price")}>
                <span>Giá tiền: </span> {formattedPrice}/kg
              </div>
              <div className={cx("df-center", "button")}>
                <button
                  type="button"
                  // onClick={() => handleDecrement(product.idsp)}
                  onClick={handleDecrement}
                  className={cx("input-group-text")}
                >
                  <i class="fa-solid fa-minus"></i>
                </button>
                <div className={cx("forn-control", "text-center")}>
                  <input
                    type="text"
                    aria-valuenow={1}
                    value={soluong}
                    onChange={(e) => setSoluong(e.target.value)}
                    disabled
                  />
                </div>
                <button
                  type="button"
                  // onClick={() => handleIncrement(product.idsp)}
                  onClick={handleIncrement}
                  className={cx("input-group-text")}
                >
                  <i class="fa-solid fa-plus"></i>
                </button>
                <div className={cx("quantity")}>
                  Số lượng còn {products.SLton} kg
                </div>
              </div>
              {role !== "admin" ? (
                <div className={cx("button-cart")}>
                  <button
                    onClick={() => handleAddToCart(products.SLton)}
                    // disabled={products.SLton === 0}
                  >
                    <i class="fa-solid fa-cart-shopping"></i>
                    <span> Thêm vào giỏ hàng</span>
                  </button>
                  <button
                    onClick={() => handleBuyClick(products.SLton)}
                    // disabled={products.SLton === 0}
                  >
                    <span>Mua hàng</span>
                  </button>
                </div>
              ) : null}
            </div>
            <div className={cx("clear")}></div>
          </div>
          <hr></hr>
          <div className={cx("describe")}>
            <div dangerouslySetInnerHTML={{ __html: products.mota }}></div>
          </div>

          <div className={cx("prescription")}>
            <div className={cx("title-prescription")}>Bài thuốc:</div>
            <div dangerouslySetInnerHTML={{ __html: products.baithuoc }}></div>
          </div>
        </div>
        <div className={cx("clear")}></div>
      </div>
    </GlobalStyles>
  );
}
