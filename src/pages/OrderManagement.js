import React, { useState, useEffect } from "react";
import baseURL from "../utils/httpRequest.js";
import { Helmet } from "react-helmet";
import moment from "moment";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import classnames from "classnames/bind";
import style from "../components/assets/styles/Management.module.scss";
import GlobalStyles from "../components/assets/GlobalStyles";
import { useHistory, Link } from "react-router-dom/cjs/react-router-dom.min";

const cx = classnames.bind(style);

const OrderManagement = () => {
  const [data, setData] = useState([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const history = useHistory();

  const getInvoice = async () => {
    try {
      const response = await fetch(`${baseURL}invoice/`);
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
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
            <th>Mã hoá đơn</th>
            <th>Ngày lập</th>
            <th>Trạng thái</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((invoice, index) => (
            <tr
              key={invoice.idhd}
              onClick={() => handleRowClick(index)}
              style={{
                backgroundColor:
                  selectedRowIndex === index ? "#53a564" : "white",
                color: selectedRowIndex === index ? "white" : "black",
                cursor: "pointer",
              }}
            >
              <td>{index + 1}</td>
              <td>{invoice.idhd}</td>
              <td>{moment(invoice.ngaylap).format("YYYY-MM-DD HH:mm:ss")}</td>
              <td>{invoice.dadathang ? "Đã đặt hàng" : "Chưa đặt hàng"}</td>
              <td className={cx("bt-edit")}>
                <span>
                  <a href={`/order-management/order-detail/${invoice.idhd}`}>
                    <i class="fa-regular fa-eye"></i>
                  </a>
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
      getInvoice();
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
          <title>Quản lý đơn hàng</title>
        </Helmet>
      </div>
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <div className={cx("title")}>QUẢN LÝ ĐƠN HÀNG</div>
          {createTable()}
        </div>
        <div className={cx("clear")}></div>
      </div>
    </GlobalStyles>
  );
};
export default OrderManagement;
