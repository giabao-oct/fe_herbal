import React, { useState, useEffect } from "react";
import baseURL from "../utils/httpRequest.js";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import classnames from "classnames/bind";
import style from "../components/assets/styles/ReceiptAdd.module.scss";
import GlobalStyles from "../components/assets/GlobalStyles";

const cx = classnames.bind(style);

const ReceiptAdd = () => {
  const iduser = Cookies.get("id");
  const [selectedId, setSelectedId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const history = useHistory();

  const fetchData = async () => {
    axios
      .get(`${baseURL}product/`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  const handleSelectChange = (event) => {
    setSelectedId(event.target.value);
  };

  const handleAddToSelectedProducts = () => {
    if (selectedId !== "" && quantity !== "" && unitPrice !== "") {
      const product = products.find(
        (p) => p.idsp.toString() === selectedId.toString()
      );
      const newSelectedProduct = {
        idsp: selectedId,
        tensp: product.tensp,
        soluongnhap: quantity,
        dongianhap: unitPrice,
      };

      setSelectedProducts([...selectedProducts, newSelectedProduct]);
      setSelectedId("");
      setQuantity("");
      setUnitPrice("");
    } else {
      Swal.fire({
        icon: "info",
        title: "Thông báo",
        text: "Vui lòng nhập đủ thông tin.",
      });
    }
  };

  const handleRemoveFromSelectedProducts = (index) => {
    const updatedSelectedProducts = [...selectedProducts];
    updatedSelectedProducts.splice(index, 1);
    setSelectedProducts(updatedSelectedProducts);
  };

  const handleSubmit = async () => {
    const data = {
      iduser: iduser,
      chi_tiet_phieu_nhap: selectedProducts,
    };

    try {
      const response = await fetch(`${baseURL}create-receipt/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Nhập hàng thành công!",
        }).then((result) => {
          if (result.isConfirmed) {
            history.push("/receipt-management");
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
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
    }
    fetchData();
  }, []);

  return (
    <GlobalStyles>
      <div>
        <Helmet>
          <title>Nhập hàng</title>
        </Helmet>
      </div>
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <div className={cx("title")}>NHẬP HÀNG</div>
          <div>
            <div className={cx("input-field")}>
              <label>Chọn sản phẩm:</label>
              <select value={selectedId} onChange={handleSelectChange} required>
                <option value="">Chọn sản phẩm</option>
                {products.map((product) => (
                  <option key={product.idsp} value={product.idsp}>
                    {product.tensp}
                  </option>
                ))}
              </select>
            </div>
            <div className={cx("input-field")}>
              <label>Số lượng nhập:</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
            <div className={cx("input-field")}>
              <label>Đơn giá nhập:</label>
              <input
                type="number"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                required
              />
            </div>
            <div className={cx("bt-save")}>
              <button onClick={handleAddToSelectedProducts}>
                Thêm vào bảng
              </button>
            </div>
          </div>

          {/* Bảng hiển thị sản phẩm đã chọn */}
          <h2>Sản phẩm đã thêm:</h2>
          <table>
            <thead>
              <tr>
                <th>Mã sản phẩm</th>
                <th>Tên sản phẩm</th>
                <th>Số lượng</th>
                <th>Đơn giá</th>
                <th>Xóa</th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.map((product, index) => (
                <tr key={index}>
                  <td>{product.idsp}</td>
                  <td>{product.tensp}</td>
                  <td>{product.soluongnhap}</td>
                  <td>{product.dongianhap}</td>
                  <td>
                    <div
                      onClick={() => handleRemoveFromSelectedProducts(index)}
                    >
                      <i class="fa-solid fa-circle-xmark"></i>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={cx("bt-save")}>
            <button onClick={handleSubmit}>Tạo phiếu nhập</button>
          </div>
        </div>
      </div>
      <div className={cx("clear")}></div>
    </GlobalStyles>
  );
};
export default ReceiptAdd;
