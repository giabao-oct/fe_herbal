import React, { useState, useEffect } from "react";
import baseURL from "../utils/httpRequest.js";
import axios from "axios";
import moment from "moment";
import classnames from "classnames/bind";
import style from "../components/assets/styles/OrderDetail.module.scss";
import GlobalStyles from "../components/assets/GlobalStyles";

const cx = classnames.bind(style);

export default function OrderDetail() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUrl = window.location.href;
  const regex = /\/(\d+)$/;
  const match = currentUrl.match(regex);
  const idhd = match ? match[1] : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}order-detail/${idhd}/`);
        setOrder(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [idhd]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!order) {
    return <p>Đơn hàng không tồn tại</p>;
  }

  const formatCurrency = (amount, locale = "vi-VN", currency = "VND") => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(amount);
  };

  return (
    <GlobalStyles>
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <div className={cx("title")}>CHI TIẾT ĐƠN HÀNG</div>

          <div>
            <h1>Chi tiết đơn hàng #{order.idhd}</h1>
            <p>
              Ngày lập: {moment(order.ngaylap).format("YYYY-MM-DD HH:mm:ss")}
            </p>
            <p>
              Trạng thái:
              {order.dadathang ? " Đã đặt hàng" : " Chưa đặt hàng"}
            </p>
            <p>Họ tên người đặt: {order.hoten}</p>
            <p>Số điện thoại: {order.sdt}</p>
            <p>Địa chỉ: {order.diachi}</p>
            <h2>Chi tiết sản phẩm:</h2>
            <table>
              <thead>
                <tr>
                  <th>Tên sản phẩm</th>
                  <th>Giá bán</th>
                  <th>số lượng</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.chitietsanpham.map((sp, index) => (
                  <tr key={index}>
                    <td>{sp.tensp}</td>
                    <td>{formatCurrency(sp.giaban)}</td>
                    <td>{sp.soluong}</td>
                    <td>{formatCurrency(sp.soluong * sp.giaban)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p>Tổng tiền: {formatCurrency(order.tongtien)}</p>
          </div>
        </div>
        <div className={cx("clear")}></div>
      </div>
    </GlobalStyles>
  );
}
