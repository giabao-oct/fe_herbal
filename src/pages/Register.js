import React, { useState } from "react";
import baseURL from "../utils/httpRequest.js";
import { Helmet } from "react-helmet";
import axios from "axios";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import classnames from "classnames/bind";
import style from "../components/assets/styles/Register.module.scss";
import GlobalStyles from "../components/assets/GlobalStyles";

const cx = classnames.bind(style);

export default function Register() {
  const [isSecActive, setIsSecActive] = useState(false);
  const [tendn, setTendn] = useState("");
  const [hoten, setHoten] = useState("");
  const [sdt, setSdt] = useState("");
  const [email, setEmail] = useState("");
  const [gioitinh, setGioitinh] = useState("Nam");
  const [diachi, setDiachi] = useState("");
  const [matkhau, setMatkhau] = useState("");
  const [isRequiredS, setIsRequiredS] = useState("true");
  const history = useHistory();

  const handleNextClick = (e) => {
    e.preventDefault();
    if (tendn !== "" && hoten !== "" && sdt !== "" && email !== "") {
      if (!validatePhoneNumber(sdt)) {
        Swal.fire({
          icon: "warning",
          title: "cảnh báo",
          text: "Số điện thoại không hợp lệ.",
        });
        setIsRequiredS(false);
        return;
      }
      if (!validateEmail(email)) {
        Swal.fire({
          icon: "warning",
          title: "cảnh báo",
          text: "Email không hợp lệ.",
        });
        setIsRequiredS(false);
        return;
      }
      setIsRequiredS(false);
      setIsSecActive(true);
    } else {
      setIsSecActive(false);
    }
  };

  const handleBackClick = (e) => {
    e.preventDefault();
    setIsSecActive(false);
    setIsRequiredS(false);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    if (diachi !== " " && matkhau !== "") {
      const data = { tendn, hoten, sdt, email, gioitinh, diachi, matkhau };
      axios
        .post(`${baseURL}register/`, data)
        .then((response) => {
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: response.data,
          }).then((result) => {
            if (result.isConfirmed) {
              history.push("/login");
            }
          });
        })
        .catch((error) => {
          Swal.fire({
            icon: "warning",
            title: "Cảnh báo",
            text: error.response.data,
          });
        });
    } else {
      setIsRequiredS(true);
    }
  };

  return (
    <GlobalStyles>
      <div>
        <Helmet>
          <title>Đăng ký</title>
        </Helmet>
      </div>
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <div className={cx("img-avt", "col", "col-two")}>
            <img
              src={require("../components/assets/img/login1.jpg")}
              alt="avatar"
            />
          </div>
          <div className={cx("form-register", "col", "col-two")}>
            <div className={cx("title")}>ĐĂNG KÝ</div>
            <form action="#">
              <div className={cx("form", "first", { secActive: isSecActive })}>
                <div className={cx("details-number")}>
                  <div className={cx("input-field")}>
                    <label class={cx("label-on-border")}>Tên đăng nhập</label>
                    <input
                      type="text"
                      placeholder="Tên đăng nhập"
                      required
                      value={tendn}
                      onChange={(e) => setTendn(e.target.value)}
                    />
                  </div>
                  <div className={cx("input-field")}>
                    <label class={cx("label-on-border")}>Họ và tên</label>
                    <input
                      type="text"
                      placeholder="Họ và tên"
                      required
                      value={hoten}
                      onChange={(e) => setHoten(e.target.value)}
                    />
                  </div>
                  <div className={cx("input-field")}>
                    <label class={cx("label-on-border")}>Số điện thoại</label>
                    <input
                      type="text"
                      placeholder="Số điện thoại"
                      required
                      value={sdt}
                      onChange={(e) => setSdt(e.target.value)}
                    />
                  </div>
                  <div className={cx("input-field")}>
                    <label class={cx("label-on-border")}>Email</label>
                    <input
                      type="text"
                      placeholder="Email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <button
                    className={cx("next-bt")}
                    onClick={(e) => handleNextClick(e)}
                  >
                    <span className={cx("bt-text")}>Tiếp theo</span>
                    <i class="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </div>

              <div className={cx("form", "second", { secActive: isSecActive })}>
                <div className={cx("deltails-personal")}>
                  <div className={cx("input-field")}>
                    <select
                      value={gioitinh}
                      onChange={(e) => setGioitinh(e.target.value)}
                    >
                      <option>Nam</option>
                      <option>Nữ</option>
                      <option>Khác</option>
                    </select>
                  </div>
                  <div className={cx("input-field")}>
                    <label class={cx("label-on-border")}>Địa chỉ</label>
                    <input
                      type="text"
                      placeholder="Địa chỉ"
                      required={isRequiredS}
                      value={diachi}
                      onChange={(e) => setDiachi(e.target.value)}
                    />
                  </div>
                  <div className={cx("input-field")}>
                    <label class={cx("label-on-border")}>Mật khẩu</label>
                    <input
                      type="password"
                      placeholder="Mật khẩu"
                      required={isRequiredS}
                      value={matkhau}
                      onChange={(e) => setMatkhau(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  className={cx("back-bt")}
                  onClick={(e) => handleBackClick(e)}
                >
                  <i class="fa-solid fa-arrow-left"></i>
                  <span className={cx("bt-text")}>Quay lại</span>
                </button>
                <button
                  className={cx("back-bt")}
                  onClick={(e) => handleRegisterClick(e)}
                >
                  Đăng ký
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </GlobalStyles>
  );
}
