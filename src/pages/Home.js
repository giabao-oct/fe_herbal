import React, { useState, useEffect } from "react";
import baseURL from "../utils/httpRequest.js";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet";
import classnames from "classnames/bind";
import style from "../components/assets/styles/Home.module.scss";
import GlobalStyles from "../components/assets/GlobalStyles";
import Cookies from "js-cookie";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const cx = classnames.bind(style);

export default function Home() {
  const [topbestselling, setTopBestSelling] = useState([]);
  const [topviewproduct, setTopViewProducts] = useState([]);
  const [news, setNews] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const iduser = Cookies.get("id");
  const role = Cookies.get("role");

  const history = useHistory();

  const handleBuyClick = (idsp, slton) => {
    if (slton === 0) {
      Swal.fire({
        icon: "warning",
        title: "Thông báo",
        text: "Sản phẩm đã hết",
      });
    } else {
      if (loggedIn) {
        history.push(`/checkout?product=${idsp}&quantity=1`);
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
    }
  };

  useEffect(() => {
    if ((iduser, role === "user")) {
      setLoggedIn(true);
    }
    axios
      .get(`${baseURL}top-best-selling/`)
      .then((response) => {
        setTopBestSelling(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi tải dữ liệu từ API:", error);
      });
    axios
      .get(`${baseURL}top-viewed-products/`)
      .then((response) => {
        setTopViewProducts(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi tải dữ liệu từ API:", error);
      });
    axios
      .get(`${baseURL}top-viewed-news/`)
      .then((response) => {
        setNews(response.data.slice(0, 3));
      })
      .catch((error) => {
        console.error("Lỗi khi tải dữ liệu từ API:", error);
      });
  }, []);

  const increaseViewCount = async (id) => {
    try {
      await axios.post(`${baseURL}increase-view-count/${id}/`);
    } catch (error) {
      console.error("Lỗi khi cập nhật lượt truy cập:", error);
    }
  };
  const increaseViewNews = async (id) => {
    try {
      await axios.post(`${baseURL}increase-view-news/${id}/`);
    } catch (error) {
      console.error("Lỗi khi cập nhật lượt truy cập:", error);
    }
  };
  const bestSelling = () => {
    return topbestselling.map((product) => (
      <div className={cx("card-product", "col col-four")} key={product.idsp}>
        <div className={cx("card-cover")}>
          <Link
            to={`/products/product-detail/${product.idsp}`}
            onClick={() => increaseViewCount(product.idsp)}
          >
            <div className={cx("img-card-product")}>
              <img src={product.anhsp.split(",")[0]} alt="" />
            </div>
          </Link>

          <div className={cx("card-body")}>
            <Link
              to={`/products/product-detail/${product.idsp}`}
              onClick={() => increaseViewCount(product.idsp)}
            >
              <div
                className={cx("card-top", "d-flex", "justify-content-between")}
              >
                <span className={cx("d-flex", "gap-5-px", "font-w-700")}>
                  {product.tensp}
                </span>
                <span>Đã bán {product.tong_so_luong} kg</span>
              </div>
              <div className={cx("title-card-body")}>{product.tenkhoahoc}</div>
            </Link>

            <div
              className={cx("card-bottom", "d-flex", "justify-content-between")}
            >
              <div className={cx("d-flex", "align-items-center", "price")}>
                <span>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.giaban)}{" "}
                  /kg
                </span>
              </div>

              {role !== "admin" ? (
                <button
                  // disabled={product.SLton === 0}
                  onClick={() => handleBuyClick(product.idsp, product.SLton)}
                >
                  Mua hàng
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    ));
  };

  const displayProduct = () => {
    return topviewproduct.map((product) => (
      <div className={cx("card-product", "col col-four")} key={product.idsp}>
        <div className={cx("card-cover")}>
          <Link
            to={`/products/product-detail/${product.idsp}`}
            onClick={() => increaseViewCount(product.idsp)}
          >
            <div className={cx("img-card-product")}>
              <img src={product.anhsp.split(",")[0]} alt="" />
            </div>
          </Link>

          <div className={cx("card-body")}>
            <Link
              to={`/products/product-detail/${product.idsp}`}
              onClick={() => increaseViewCount(product.idsp)}
            >
              <div
                className={cx("card-top", "d-flex", "justify-content-between")}
              >
                <span className={cx("d-flex", "gap-5-px", "font-w-700")}>
                  {product.tensp}
                </span>
                {/* <span className={cx("d-flex gap-5-px")}>{product.giaban}</span> */}
              </div>
              <div className={cx("title-card-body")}>{product.tenkhoahoc}</div>
            </Link>

            <div
              className={cx("card-bottom", "d-flex", "justify-content-between")}
            >
              <div className={cx("d-flex", "align-items-center", "price")}>
                <span>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.giaban)}{" "}
                  /kg
                </span>
              </div>

              {role !== "admin" ? (
                <button
                  // disabled={product.SLton === 0}
                  onClick={() => handleBuyClick(product.idsp, product.SLton)}
                >
                  Mua hàng
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <GlobalStyles>
      <div>
        <Helmet>
          <title>Trang chủ</title>
        </Helmet>
      </div>
      <div className={cx("wrapper")}>
        <div className={cx("slide-show")}>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            loop={true}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            className={cx("mySwiper")}
            slidesPerView={1}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            speed={2000}
          >
            <SwiperSlide>
              <div>
                <img src={require("../components/assets/img/banner1.png")} />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                <img src={require("../components/assets/img/banner2.png")} />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                <img src={require("../components/assets/img/banner3.png")} />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
        <div className={cx("container")}>
          <div className={cx("product-container")}>
            <div className={cx("product")}>
              <div className={cx("title")}>
                Sản phẩm<span>Bán chạy nhất</span>
              </div>
              {bestSelling()}
              <div className={cx("clear")}></div>
            </div>
            <div className={cx("clear")}></div>
          </div>
          <div className={cx("product-container")}>
            <div className={cx("product")}>
              <div className={cx("title")}>
                Sản phẩm<span>Được xem nhiều nhất</span>
              </div>
              {displayProduct()}
              <div className={cx("clear")}></div>
            </div>
            <div className={cx("clear")}></div>
          </div>
          <div className={cx("news-container")}>
            <div className={cx("news")}>
              <div className={cx("title")}>
                Tin tức<span>Được xem nhiều nhất</span>
              </div>
              <div className={cx("news-hot")}>
                {news.map((news) => (
                  <div>
                    <Link
                      to={`/news/news-detail/${news.idtt}`}
                      className={cx("project-hrel", "")}
                      onClick={() => increaseViewNews(news.idtt)}
                      key={news.idtt}
                    >
                      <div className={cx("project")}>
                        <div className={cx("col", "col-one-third")}>
                          <img src={news.anhtt} alt="" />
                        </div>

                        <div
                          className={cx(
                            "col",
                            "col-two-third",
                            "container-content-project"
                          )}
                        >
                          <div
                            className={cx("title-project", "font-weight700")}
                          >
                            {news.tieude}
                          </div>
                          <div className={cx("content-project")}>
                            {news.mota}
                          </div>
                        </div>
                        <div className={cx("clear")}></div>
                      </div>
                    </Link>
                    <hr />
                  </div>
                ))}
              </div>
              <div className={cx("clear")}></div>
            </div>
          </div>
          <div className={cx("clear")}></div>
        </div>
        <div className={cx("clear")}></div>
      </div>
    </GlobalStyles>
  );
}
