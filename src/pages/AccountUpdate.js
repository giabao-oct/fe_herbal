import React, { useState, useEffect } from "react";
import baseURL from "../utils/httpRequest.js";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Editor } from "react-draft-wysiwyg";
import {
  EditorState,
  ContentState,
  convertFromHTML,
  convertToRaw,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import classnames from "classnames/bind";
import style from "../components/assets/styles/AccountUpdate.module.scss";
import GlobalStyles from "../components/assets/GlobalStyles";

const cx = classnames.bind(style);

const AccountUpdate = () => {
  const [avt, setAvt] = useState("");
  const [tendn, setTendn] = useState("");
  const [hoten, setHoten] = useState("");
  const [sdt, setSdt] = useState("");
  const [email, setEmail] = useState("");
  const [gioitinh, setGioitinh] = useState("Nam");
  const [diachi, setDiachi] = useState("");
  const [matkhau, setMatkhau] = useState("");
  const [quyen, setQuyen] = useState("");
  const history = useHistory();
  const currentUrl = window.location.href;
  const regex = /\/(\d+)$/;
  const match = currentUrl.match(regex);
  const iduser = match ? match[1] : null;

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
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseURL}account-detail/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ iduser }),
        });
        const data = await response.json();
        setAvt(data.avt);
        setTendn(data.tendn);
        setHoten(data.hoten);
        setSdt(data.sdt);
        setEmail(data.email);
        setGioitinh(data.gioitinh);
        setDiachi(data.diachi);
        setMatkhau(data.matkhau);
        setQuyen(data.quyen);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchData();
  }, [iduser]);

  const handleSaveAccount = async () => {
    const data = {
      quyen: quyen,
    };
    try {
      const response = await fetch(`${baseURL}update-account/${iduser}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${JSON.stringify(errorData)}`);
        return;
      }
      const responseData = await response.json();
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: responseData,
      }).then((result) => {
        if (result.isConfirmed) {
          history.push("/account-management");
        }
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <GlobalStyles>
      <div>
        <Helmet>
          <title>Xem thông tin tài khoản</title>
        </Helmet>
      </div>
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <div className={cx("title")}>XEM THÔNG TIN TÀI KHOẢN</div>
          <div className={cx("avatar")}>
            <img src={avt} alt="avatar" />
          </div>
          <div className={cx("input-field")}>
            <label>Tên đăng nhập</label>
            <input
              type="text"
              placeholder="Tên đăng nhập"
              required
              value={tendn}
              onChange={(e) => setTendn(e.target.value)}
              disabled
            />
          </div>
          <div className={cx("input-field")}>
            <label>Họ tên</label>
            <input
              type="text"
              placeholder="Họ tên"
              required
              value={hoten}
              onChange={(e) => setHoten(e.target.value)}
              disabled
            />
          </div>
          <div className={cx("input-field")}>
            <label>Giới tính</label>
            <input
              type="text"
              placeholder="Giới tính"
              required
              value={gioitinh}
              onChange={(e) => setGioitinh(e.target.value)}
              disabled
            />
            <div className={cx("input-field")}>
              <label>Số điện thoại</label>
              <input
                type="text"
                placeholder="Số điện thoại"
                required
                value={sdt}
                onChange={(e) => setSdt(e.target.value)}
                disabled
              />
            </div>
            <div className={cx("input-field")}>
              <label>Email</label>
              <input
                type="text"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled
              />
            </div>
            <div className={cx("input-field")}>
              <label>Địa chỉ</label>
              <textarea
                type="text"
                placeholder="Địa chỉ"
                required
                value={diachi}
                onChange={(e) => setDiachi(e.target.value)}
                disabled
              />
            </div>
            <div className={cx("input-field")}>
              <label>Mật khẩu</label>
              <input
                type="password"
                placeholder="matkhau"
                required
                value={matkhau}
                onChange={(e) => setMatkhau(e.target.value)}
                disabled
              />
            </div>
            <div className={cx("input-field")}>
              <label>Quyền</label>
              <select value={quyen} onChange={(e) => setQuyen(e.target.value)}>
                <option>admin</option>
                <option>user</option>
              </select>
            </div>
          </div>

          <div className={cx("bt-save")}>
            <button onClick={handleSaveAccount}>
              <span>
                <i class="fa-regular fa-floppy-disk"></i>
              </span>
              <span>Lưu</span>
            </button>
          </div>
        </div>
      </div>
      <div className={cx("clear")}></div>
    </GlobalStyles>
  );
};
export default AccountUpdate;
