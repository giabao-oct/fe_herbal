import React, { useState, useEffect } from "react";
import baseURL from "../utils/httpRequest.js";
import { Helmet } from "react-helmet";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import classnames from "classnames/bind";
import style from "../components/assets/styles/Management.module.scss";
import GlobalStyles from "../components/assets/GlobalStyles";
import { useHistory, Link } from "react-router-dom/cjs/react-router-dom.min";

const cx = classnames.bind(style);

const AccountManagement = () => {
  const [data, setData] = useState([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const history = useHistory();

  // Lấy dữ liệu từ API Django
  const getAccount = async () => {
    try {
      const response = await fetch(`${baseURL}account/`, {
        method: "POST",
      });
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDeleteClick = async (iduser) => {
    const confirmDelete = await Swal.fire({
      icon: "info",
      title: "Thông tin",
      text: "Bạn có chắc xoá tài khoản này không?",
      showCancelButton: true,
      confirmButtonText: "Xoá",
      cancelButtonText: "Hủy",
    });

    if (confirmDelete.isConfirmed) {
      try {
        await axios.delete(`${baseURL}delete-account/${iduser}`);

        setSelectedRowIndex(null);
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Xoá tài khoản thành công!",
        }).then((result) => {
          if (result.isConfirmed) {
            getAccount();
          }
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Xoá tài khoản thất bại!",
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
            <th>Họ tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Quyền</th>
            <th>
              {/* <Link to="/product-management/product-add">
                <i class="fa-solid fa-plus"></i>
              </Link> */}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((account, index) => (
            <tr
              key={account.iduser}
              onClick={() => handleRowClick(index)}
              style={{
                backgroundColor:
                  selectedRowIndex === index ? "#53a564" : "white",
                color: selectedRowIndex === index ? "white" : "black",
                cursor: "pointer",
              }}
            >
              <td>{index + 1}</td>
              <td>{account.hoten}</td>
              <td>{account.email}</td>
              <td>{account.sdt}</td>
              <td>{account.quyen}</td>
              <td className={cx("bt-edit")}>
                <span>
                  <a
                    href={`/account-management/account-update/${account.iduser}`}
                  >
                    <i class="fa-regular fa-pen-to-square"></i>
                  </a>
                </span>
                <span>
                  <i
                    class="fa-regular fa-trash-can"
                    onClick={() => handleDeleteClick(account.iduser)}
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
      getAccount();
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
          <title>Quản lý tài khoản</title>
        </Helmet>
      </div>
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <div className={cx("title")}>QUẢN LÝ TÀI KHOẢN</div>
          {createTable()}
        </div>
        <div className={cx("clear")}></div>
      </div>
    </GlobalStyles>
  );
};
export default AccountManagement;
