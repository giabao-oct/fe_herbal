import React, { useState, useEffect } from "react";
import baseURL from "../utils/httpRequest.js";
import { Helmet } from "react-helmet";
import axios from "axios";
import classnames from "classnames/bind";
import style from "../components/assets/styles/DiseaseDetail.module.scss";
import GlobalStyles from "../components/assets/GlobalStyles";

const cx = classnames.bind(style);

export default function DiseaseDetail() {
  const [disease, setDisease] = useState([]);
  const currentUrl = window.location.href;
  const regex = /\/(\d+)$/;
  const match = currentUrl.match(regex);
  const idbenh = match ? match[1] : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseURL}disease-detail/${idbenh}/`);
        const data = await response.json();
        setDisease(data);
      } catch (error) {
        console.error("Error fetching disease details:", error);
      }
    };

    fetchData();
  }, [idbenh]);

  if (!disease || !disease.anhbenh) {
    return <div>No disease data available</div>;
  }

  return (
    <GlobalStyles>
      <div>
        <Helmet>
          <title>Chi tiết bệnh cảm</title>
        </Helmet>
      </div>
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <div className={cx("title")}>{disease.tenbenh}</div>
          <div className={cx("describe")}>
            <div dangerouslySetInnerHTML={{ __html: disease.noidung }}></div>
          </div>
        </div>
      </div>
    </GlobalStyles>
  );
}
