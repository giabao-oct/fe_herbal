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

const DiseaseManagement = () => {
  const [data, setData] = useState([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const history = useHistory();

  // Lấy dữ liệu từ API Django
  const getDisease = async () => {
    try {
      const response = await fetch(`${baseURL}disease/`);
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDeleteClick = async (idbenh) => {
    const confirmDelete = await Swal.fire({
      icon: "info",
      title: "Thông tin",
      text: "Bạn có chắc xoá bệnh này không?",
      showCancelButton: true,
      confirmButtonText: "Xoá",
      cancelButtonText: "Hủy",
    });

    if (confirmDelete.isConfirmed) {
      try {
        await axios.delete(`${baseURL}delete-disease/${idbenh}`);

        setSelectedRowIndex(null);
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Xoá bệnh thành công!",
        }).then((result) => {
          if (result.isConfirmed) {
            getDisease();
          }
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Xoá bệnh thất bại!",
        });
      }
    }
  };

  const handleRowClick = (index) => {
    setSelectedRowIndex(index);
  };
  const removeHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const createTable = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên bệnh</th>
            <th>Nội dung</th>
            <th>
              <Link to="/disease-management/disease-add">
                <i class="fa-solid fa-plus"></i>
              </Link>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((disease, index) => (
            <tr
              key={disease.idbenh}
              onClick={() => handleRowClick(index)}
              style={{
                backgroundColor:
                  selectedRowIndex === index ? "#53a564" : "white",
                color: selectedRowIndex === index ? "white" : "black",
                cursor: "pointer",
              }}
            >
              <td>{index + 1}</td>
              <td>{disease.tenbenh}</td>
              <td>{removeHtmlTags(disease.noidung).slice(0, 100)}</td>
              <td className={cx("bt-edit")}>
                <span>
                  <Link
                    to={`/disease-management/disease-update/${disease.idbenh}`}
                  >
                    <i class="fa-regular fa-pen-to-square"></i>
                  </Link>
                </span>
                <span>
                  <i
                    class="fa-regular fa-trash-can"
                    onClick={() => handleDeleteClick(disease.idbenh)}
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
      getDisease();
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
          <title>Quản lý bệnh</title>
        </Helmet>
      </div>
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <div className={cx("title")}>QUẢN LÝ BỆNH</div>
          {createTable()}
        </div>
        <div className={cx("clear")}></div>
      </div>
    </GlobalStyles>
  );
};
export default DiseaseManagement;
