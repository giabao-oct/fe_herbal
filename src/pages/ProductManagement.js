import React, { useState, useEffect } from "react";
import baseURL from "../utils/httpRequest.js";
import { useHistory, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import classnames from "classnames/bind";
import style from "../components/assets/styles/Management.module.scss";
import GlobalStyles from "../components/assets/GlobalStyles";

const cx = classnames.bind(style);

const ProductManagement = () => {
  const [data, setData] = useState([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const history = useHistory();

  // Lấy dữ liệu từ API Django
  const getProduct = async () => {
    try {
      const response = await fetch(`${baseURL}product/`);
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDeleteClick = async (idsp) => {
    const confirmDelete = await Swal.fire({
      icon: "info",
      title: "Thông báo",
      text: "Bạn có chắc xoá sản phẩm này không?",
      showCancelButton: true,
      confirmButtonText: "Xoá",
      cancelButtonText: "Hủy",
    });

    if (confirmDelete.isConfirmed) {
      try {
        await axios.delete(`${baseURL}delete-product/${idsp}`);

        setSelectedRowIndex(null);
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Xoá sản phẩm thành công!",
        }).then((result) => {
          if (result.isConfirmed) {
            getProduct();
          }
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Xoá sản phẩm thất bại!",
        });
      }
    }
  };

  const handleRowClick = (index) => {
    setSelectedRowIndex(index);
  };

  const createTable = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên sản phẩm</th>
            <th>Tên khoa học</th>
            <th>Công dụng</th>
            <th>Giá bán</th>
            <th>Số lượng tồn</th>
            <th>
              <Link to="/product-management/product-add">
                <i class="fa-solid fa-plus"></i>
              </Link>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((product, index) => (
            <tr
              key={product.idsp}
              onClick={() => handleRowClick(index)}
              style={{
                backgroundColor:
                  selectedRowIndex === index ? "#53a564" : "white",
                color: selectedRowIndex === index ? "white" : "black",
                cursor: "pointer",
              }}
            >
              <td>{index + 1}</td>
              <td>{product.tensp}</td>
              <td>{product.tenkhoahoc}</td>
              <td>{product.congdung}</td>
              <td>{product.giaban}</td>
              <td>{product.SLton}</td>
              <td className={cx("bt-edit")}>
                <span>
                  <Link
                    to={`/product-management/product-update/${product.idsp}`}
                  >
                    <i class="fa-regular fa-pen-to-square"></i>
                  </Link>
                </span>
                <span>
                  <i
                    class="fa-regular fa-trash-can"
                    onClick={() => handleDeleteClick(product.idsp)}
                  ></i>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  useEffect(() => {
    const role = Cookies.get("role");

    if (role !== "admin") {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Bạn không có quyền truy cập trang này.",
      }).then((result) => {
        if (result.isConfirmed) {
          history.push("/");
        }
      });
    } else {
      getProduct();
    }
    const handleOutsideClick = (e) => {
      if (!e.target.closest("table")) {
        setSelectedRowIndex(null);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <GlobalStyles>
      <div>
        <Helmet>
          <title>Quản lý sản phẩm</title>
        </Helmet>
      </div>
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <div className={cx("title")}>QUẢN LÝ SẢN PHẨM</div>
          {createTable()}
        </div>
        <div className={cx("clear")}></div>
      </div>
    </GlobalStyles>
  );
};
export default ProductManagement;
