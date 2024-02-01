import React, { useState, useEffect } from "react";
import baseURL from "../utils/httpRequest.js";
import { Helmet } from "react-helmet";
import axios from "axios";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import classnames from "classnames/bind";
import style from "../components/assets/styles/Login.module.scss";
import GlobalStyles from "../components/assets/GlobalStyles";

const cx = classnames.bind(style);

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const currentUrl = window.location.href;
  const hasToken = currentUrl.includes("token=");
  const history = useHistory();
  const regex = /token=(.*?)(?:\/|$)/;
  const match = currentUrl.match(regex);
  const extractedToken = match ? match[1] : null;
  useEffect(() => {
    if (hasToken) {
    } else {
    }
  }, [hasToken]);

  const handleSubmitReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Mật khẩu nhập lại không khớp!.",
      });
      return;
    }

    const response = await resetPassword({
      new_password: password,
      token: extractedToken,
    });
    // alert(response.message);
  };

  const resetPassword = async (data) => {
    try {
      const response = await axios.post(`${baseURL}reset-password/`, data);
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đặt lại mật khẩu thành công!",
      }).then((result) => {
        if (result.isConfirmed) {
          history.push("/login");
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Đặt lại mật khẩu thất bại! Mã đã hết hạn hoặc không đúng.",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${baseURL}check-mail/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        Swal.fire({
          icon: "info",
          title: "Thông tin",
          text: "Vui lòng kiểm tra email để đặt lại mật khẩu.",
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: "warning",
          text: "Email không đúng hoặc không tồn tại!",
        });
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <GlobalStyles>
      <div>
        <Helmet>
          <title>Đặt lại mật khẩu</title>
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
          <div className={cx("form-resetPass", "col", "col-two")}>
            {hasToken ? (
              <form onSubmit={handleSubmitReset}>
                <div className={cx("form", "second")}>
                  <div className={cx("details-number")}>
                    <div className={cx("title")}>Đặt lại mật khẩu</div>
                    <div className={cx("input-field")}>
                      <input
                        type="password"
                        placeholder="Mật khẩu mới"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className={cx("input-field")}>
                      <input
                        type="password"
                        placeholder="Nhập lại mật khẩu"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className={cx("login-bt")}>
                      <span className={cx("bt-text")}>Đặt lại mật khẩu</span>
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className={cx("form", "first")}>
                  <div className={cx("details-number")}>
                    <div className={cx("title")}>Đặt lại mật khẩu</div>
                    <div className={cx("input-field")}>
                      <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className={cx("login-bt")}>
                      <span className={cx("bt-text")}>Đặt lại mật khẩu</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </GlobalStyles>
  );
}
