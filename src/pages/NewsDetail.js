import React, { useState, useEffect } from "react";
import baseURL from "../utils/httpRequest.js";
import { Helmet } from "react-helmet";
import axios from "axios";
import classnames from "classnames/bind";
import style from "../components/assets/styles/DiseaseDetail.module.scss";
import GlobalStyles from "../components/assets/GlobalStyles";

const cx = classnames.bind(style);

export default function NewsDetail() {
  const [news, setNews] = useState([]);
  const currentUrl = window.location.href;
  const regex = /\/(\d+)$/;
  const match = currentUrl.match(regex);
  const idtt = match ? match[1] : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseURL}news-detail/${idtt}/`);
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error("Error fetching news details:", error);
      }
    };

    fetchData();
  }, [idtt]);

  if (!news || !news.anhtt) {
    return <div>No news data available</div>;
  }

  return (
    <GlobalStyles>
      <div>
        <Helmet>
          <title>Chi tiết tin tức</title>
        </Helmet>
      </div>
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <div className={cx("title")}>{news.tieude}</div>
          <div className={cx("describe")}>
            <div dangerouslySetInnerHTML={{ __html: news.noidung }}></div>
          </div>
        </div>
      </div>
    </GlobalStyles>
  );
}
