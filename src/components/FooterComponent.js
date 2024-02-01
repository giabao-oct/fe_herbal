import React, { useState, useRef, useEffect } from "react";
import classname from "classnames/bind";

import Modal from "./Modal";
import style from "./assets/styles/FooterComponent.module.scss";
import GlobalStyles from "./assets/GlobalStyles";

const cx = classname.bind(style);

export default function FooterComponent() {
  return (
    <GlobalStyles>
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <div className={cx("info")}>
            <a href="" className={cx("set-icon", "set-icon-f")}>
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="" className={cx("set-icon")}>
              <i class="fab fa-google"></i>
            </a>
            <a href="" className={cx("set-icon")}>
              <i class="fab fa-instagram"></i>
            </a>
            <a href="" className={cx("set-icon")}>
              <i class="fab fa-linkedin-in"></i>
            </a>
            {/* <a href="" className={cx("set-icon", "set-icon-github")}>
              <i class="fa-brands fa-github"></i>
            </a> */}
          </div>
        </div>
        <div className={cx("copyright")}>&copy; 2023 Copyright</div>
      </div>
    </GlobalStyles>
  );
}
