import React, { useState } from "react";
import baseURL from "../utils/httpRequest.js";
import { Helmet } from "react-helmet";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import classnames from "classnames/bind";
import style from "../components/assets/styles/Login.module.scss";
import GlobalStyles from "../components/assets/GlobalStyles";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const cx = classnames.bind(style);

export default function Login() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${baseURL}login/`, {
        EmailOrPhone: emailOrPhone,
        matkhau: password,
      });

      Cookies.set("id", response.data.iduser);
      Cookies.set("avt", response.data.avt);
      Cookies.set("username", response.data.tendn);
      Cookies.set("role", response.data.quyen);
      console.log(response.data);
      if (response.data.quyen === "admin") {
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Đăng nhập thành công",
        }).then((result) => {
          if (result.isConfirmed) {
            history.push("/");
            setTimeout(() => {
              window.location.reload();
            }, 50);
          }
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Đăng nhập thành công",
        }).then((result) => {
          if (result.isConfirmed) {
            const previousPath = document.referrer.replace(/\/$/, "");
            if (
              previousPath.includes("/reset-password") ||
              previousPath.includes("/register")
            ) {
              history.push("/");
            } else {
              history.goBack();
            }
            setTimeout(() => {
              window.location.reload();
            }, 50);
          }
        });
      }
    } catch (error) {
      // alert("Tài khoản mật khẩu không chính xác", error.response.data);
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Tài khoản mật khẩu không chính xác.",
      });
    }
  };

  return (
    <GlobalStyles>
      <div>
        <Helmet>
          <title>Đăng nhập</title>
        </Helmet>
      </div>
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <div className={cx("img-avt", "col", "col-two")}>
            <img
              src={require("../components/assets/img/login1.jpg")}
              alt="avatar"
            />
            <div className={cx("clear")}></div>
          </div>
          <div className={cx("form-login", "col", "col-two")}>
            <form onSubmit={handleLogin}>
              <div className={cx("form", "first")}>
                <div className={cx("details-number")}>
                  <div className={cx("title")}>ĐĂNG NHẬP</div>
                  <div className={cx("input-field")}>
                    <input
                      type="text"
                      placeholder="Số điện thoại hoặc email"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className={cx("input-field")}>
                    <input
                      type="password"
                      placeholder="Mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className={cx("login-bt")}>
                    <span className={cx("bt-text")}>Đăng nhập</span>
                  </button>
                </div>
                <div className={cx("footer-login")}>
                  <div>
                    <Link to="/reset-password" className={cx("link")}>
                      Đặt lại mật khẩu
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </GlobalStyles>
  );
}
