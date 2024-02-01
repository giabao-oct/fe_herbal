import React, { useState, useEffect } from "react";
import baseURL from "../utils/httpRequest.js";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import classnames from "classnames/bind";
import style from "../components/assets/styles/Disease.module.scss";
import GlobalStyles from "../components/assets/GlobalStyles";

const cx = classnames.bind(style);

export default function Disease() {
  const [diseases, setDisease] = useState([]);
  useEffect(() => {
    axios
      .get(`${baseURL}disease/`)
      .then((response) => {
        setDisease(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi tải dữ liệu từ API:", error);
      });
  }, []);

  return (
    <GlobalStyles>
      <div>
        <Helmet>
          <title>Bệnh cảm</title>
        </Helmet>
      </div>
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          {diseases.map((disease) => (
            <div className={cx("col", "col-two")} key={disease.idbenh}>
              <Link to={`/disease/disease-detail/${disease.idbenh}`}>
                <div className={cx("card-container")}>
                  <div className={cx("card-cover")}>
                    <div className={cx("card-img")}>
                      <img src={disease.anhbenh} alt="" />
                    </div>
                    <div className={cx("card-title")}>
                      <span>{disease.tenbenh}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </GlobalStyles>
  );
}
