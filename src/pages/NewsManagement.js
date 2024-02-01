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

const NewsManagement = () => {
  const [data, setData] = useState([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const history = useHistory();

  const getNews = async () => {
    try {
      const response = await fetch(`${baseURL}news/`);
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDeleteClick = async (idtt) => {
    const confirmDelete = await Swal.fire({
      icon: "info",
      title: "Thông tin",
      text: "Bạn có chắc xoá tin tức này không?",
      showCancelButton: true,
      confirmButtonText: "Xoá",
      cancelButtonText: "Hủy",
    });

    if (confirmDelete.isConfirmed) {
      try {
        await axios.delete(`${baseURL}delete-news/${idtt}`);

        setSelectedRowIndex(null);
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Xoá tin tức thành công!",
        }).then((result) => {
          if (result.isConfirmed) {
            getNews();
          }
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Xoá tin tức thất bại!",
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
            <th>Tiêu đề</th>
            <th>Mô tả</th>
            <th>Nội dung</th>
            <th>
              <Link to="/news-management/news-add">
                <i class="fa-solid fa-plus"></i>
              </Link>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((news, index) => (
            <tr
              key={news.idtt}
              onClick={() => handleRowClick(index)}
              style={{
                backgroundColor:
                  selectedRowIndex === index ? "#53a564" : "white",
                color: selectedRowIndex === index ? "white" : "black",
                cursor: "pointer",
              }}
            >
              <td>{index + 1}</td>
              <td>{news.tieude}</td>
              <td>{news.mota.slice(0, 50)}</td>
              <td>{removeHtmlTags(news.noidung).slice(0, 100)}</td>
              <td className={cx("bt-edit")}>
                <span>
                  <Link to={`/news-management/news-update/${news.idtt}`}>
                    <i class="fa-regular fa-pen-to-square"></i>
                  </Link>
                </span>
                <span>
                  <i
                    class="fa-regular fa-trash-can"
                    onClick={() => handleDeleteClick(news.idtt)}
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
      getNews();
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
          <title>Quản tin tức</title>
        </Helmet>
      </div>
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <div className={cx("title")}>QUẢN TIN TỨC</div>
          {data.length > 0 ? createTable() : <p>Loading...</p>}
        </div>
        <div className={cx("clear")}></div>
      </div>
    </GlobalStyles>
  );
};
export default NewsManagement;
