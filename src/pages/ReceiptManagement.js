import React, { useState, useEffect } from "react";
import baseURL from "../utils/httpRequest.js";
import { Helmet } from "react-helmet";
import axios from "axios";
import moment from "moment";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import classnames from "classnames/bind";
import style from "../components/assets/styles/Management.module.scss";
import GlobalStyles from "../components/assets/GlobalStyles";
import { useHistory, Link } from "react-router-dom/cjs/react-router-dom.min";

const cx = classnames.bind(style);

const ReceiptManagement = () => {
  const [data, setData] = useState([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const history = useHistory();

  const getReceipt = async () => {
    try {
      const response = await fetch(`${baseURL}receipt/`);
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDeleteClick = async (idpn, ngaynhap) => {
    const ngayLapTime = moment(ngaynhap);
    const currentTime = moment();
    const timeDifference = currentTime.diff(ngayLapTime, "days");
    if (timeDifference >= 2) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Phiếu nhập đã quá 2 ngày, không thể xoá!",
      });
      return;
    }
    const response = await axios.get(`${baseURL}get-receipt-details/${idpn}`);
    const receipt_detail = response.data;
    for (const detail of receipt_detail) {
      const sanPhamResponse = await axios.get(
        `${baseURL}product-detail/${detail.idsp}`
      );
      const sanPham = sanPhamResponse.data;
      if (sanPham.SLton < detail.soluongnhap) {
        Swal.fire({
          icon: "warning",
          title: "Cảnh báo",
          text: "Số lượng sản phẩm tồn kho đã hết hoặc không đủ, không thể xoá!",
        });
        return;
      }
    }
    const confirmDelete = await Swal.fire({
      icon: "info",
      title: "Thông báo",
      text: "Bạn có chắc xoá phiếu nhập này không?",
      showCancelButton: true,
      confirmButtonText: "Xoá",
      cancelButtonText: "Hủy",
    });

    if (confirmDelete.isConfirmed) {
      try {
        // await axios.delete(`${baseURL}delete-receipt/${idpn}`);
        // setSelectedRowIndex(null);
        // Swal.fire({
        //   icon: "success",
        //   title: "Thành công",
        //   text: "Xoá sản phẩm thành công!",
        // }).then((result) => {
        //   if (result.isConfirmed) {
        //     getReceipt();
        //   }
        // });
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
            <th>Mã phiếu nhập</th>
            <th>Người nhập</th>
            <th>Ngày nhập</th>
            <th>Tổng tiền</th>
            <th>
              <Link to="/receipt-management/receipt-add">
                <i class="fa-solid fa-plus"></i>
              </Link>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((receipt, index) => (
            <tr
              key={receipt.idpn}
              onClick={() => handleRowClick(index)}
              style={{
                backgroundColor:
                  selectedRowIndex === index ? "#53a564" : "white",
                color: selectedRowIndex === index ? "white" : "black",
                cursor: "pointer",
              }}
            >
              <td>{index + 1}</td>
              <td>{receipt.idpn}</td>
              <td>{receipt.hoten}</td>
              <td>{moment(receipt.ngaynhap).format("YYYY-MM-DD HH:mm:ss")}</td>
              <td>{formatCurrency(receipt.tongtien)}</td>
              <td className={cx("bt-edit")}>
                <span>
                  <i
                    class="fa-regular fa-trash-can"
                    onClick={() =>
                      handleDeleteClick(receipt.idpn, receipt.ngaynhap)
                    }
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
      getReceipt();
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
          <title>Quản lý nhập hàng</title>
        </Helmet>
      </div>
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <div className={cx("title")}>QUẢN LÝ NHẬP HÀNG</div>
          {createTable()}
        </div>
        <div className={cx("clear")}></div>
      </div>
    </GlobalStyles>
  );
};
export default ReceiptManagement;
