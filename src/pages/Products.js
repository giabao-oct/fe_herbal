import React, { useState, useEffect } from "react";
import baseURL from "../utils/httpRequest.js";
import { Helmet } from "react-helmet";
import { useHistory, useLocation, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import classnames from "classnames/bind";
import style from "../components/assets/styles/Products.module.scss";
import GlobalStyles from "../components/assets/GlobalStyles";

const cx = classnames.bind(style);

export default function Products() {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loggedIn, setLoggedIn] = useState(false);
  const iduser = Cookies.get("id");
  const role = Cookies.get("role");
  const itemsPerPage = 8;
  const history = useHistory();

  useEffect(() => {
    if ((iduser, role === "user")) {
      setLoggedIn(true);
    }
    const searchQuery = new URLSearchParams(location.search).get("search");
    if (searchQuery) {
      axios
        .get(`${baseURL}search_product/?q=${searchQuery}`)
        .then((response) => {
          setProducts(response.data);
          setTotalPages(Math.ceil(response.data.length / itemsPerPage)); // Tính tổng số trang
        })
        .catch((error) => {
          console.error("Lỗi khi tải dữ liệu từ API:", error);
        });
    } else {
      axios
        .get(`${baseURL}product/`)
        .then((response) => {
          setProducts(response.data);
          setTotalPages(Math.ceil(response.data.length / itemsPerPage)); // Tính tổng số trang
        })
        .catch((error) => {
          console.error("Lỗi khi tải dữ liệu từ API:", error);
        });
    }
  }, [location.search]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const searchQuery = new URLSearchParams(location.search).get("search");
  //       const apiUrl = searchQuery
  //         ? `${baseURL}search_product/?q=${searchQuery}`
  //         : `${baseURL}product/`;

  //       const response = await axios.get(apiUrl);
  //       setProducts(response.data);
  //     } catch (error) {
  //       console.error("Lỗi khi tải dữ liệu từ API:", error);
  //     }
  //   };

  //   fetchData();
  // }, [location.search]);

  const increaseViewCount = async (id) => {
    try {
      await axios.post(`${baseURL}increase-view-count/${id}/`);
    } catch (error) {
      console.error("Lỗi khi cập nhật lượt truy cập:", error);
    }
  };

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

  if (!products || products.length === 0) {
    return (
      <div className={cx("notification")}>
        <div className={cx("notification-container")}>
          Không tìm thấy sản phẩm
        </div>
      </div>
    );
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  const displayProduct = () => {
    return currentItems.map((product) => (
      <div className={cx("card-product", "col", "col-four")} key={product.idsp}>
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
          <title>Sản phẩm</title>
        </Helmet>
      </div>
      <div className={cx("container")}>
        <div className={cx("wrapper")}>
          <div className={cx("explore")}>
            <div className={cx("product")}>
              {displayProduct()}

              <div className={cx("clear")}></div>
            </div>
            <div className={cx("pagination", "d-flex", "gap-1-rem")}>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={cx(pageNumber === currentPage ? "active" : "")}
                    style={{
                      fontWeight:
                        pageNumber === currentPage ? "bold" : "normal",
                    }}
                  >
                    {pageNumber}
                  </button>
                )
              )}
            </div>
            <div className={cx("clear")}></div>
          </div>

          <div className={cx("clear")}></div>
        </div>
      </div>
    </GlobalStyles>
  );
}
