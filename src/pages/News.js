import React, { useState, useEffect } from "react";
import baseURL from "../utils/httpRequest.js";
import { useHistory, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import classnames from "classnames/bind";
import style from "../components/assets/styles/News.module.scss";
import GlobalStyles from "../components/assets/GlobalStyles";

const cx = classnames.bind(style);

export default function News() {
  const [news, setNews] = useState([]);
  const [topview, setTopview] = useState([]);
  useEffect(() => {
    axios
      .get(`${baseURL}news/`)
      .then((response) => {
        setNews(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi tải dữ liệu từ API:", error);
      });

    axios
      .get(`${baseURL}top-viewed-news/`)
      .then((response) => {
        setTopview(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi tải dữ liệu từ API:", error);
      });
  }, []);
  const increaseViewNews = async (id) => {
    try {
      await axios.post(`${baseURL}increase-view-news/${id}/`);
    } catch (error) {
      console.error("Lỗi khi cập nhật lượt truy cập:", error);
    }
  };

  return (
    <GlobalStyles>
      <div>
        <Helmet>
          <title>Tin tức</title>
        </Helmet>
      </div>
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <div className={cx("content-container")}>
            <div className={cx("content-title")}>
              <div className={cx("title-name", "font-weight700")}>
                Tin tức mới nhất
              </div>
              <p>
                {/* Thông tin mới, đầy đủ, hấp dẫn về thị trường lá cây thuốc Việt
                Nam thông qua dữ liệu lớn về giá, giao dịch, nguồn cung - cầu và
                khảo sát thực tế của đội ngũ phóng viên, biên tập. */}
                Khám phá thế giới dược liệu: Những thông tin mới nhất về các
                loại thảo dược và phương pháp điều trị bệnh cảm
              </p>
            </div>

            <div className={cx("col", "col-two-third", "news-left")}>
              {news.map((news) => (
                <Link
                  to={`/news/news-detail/${news.idtt}`}
                  className={cx("project-hrel")}
                  onClick={() => increaseViewNews(news.idtt)}
                  key={news.idtt}
                >
                  <div className={cx("project")}>
                    <div className={cx("col", "col-one-third")}>
                      <img src={news.anhtt} alt="" />
                    </div>

                    <div
                      className={cx(
                        "col",
                        "col-two-third",
                        "container-content-project"
                      )}
                    >
                      <div className={cx("title-project", "font-weight700")}>
                        {news.tieude}
                      </div>
                      <div className={cx("content-project")}>{news.mota}</div>
                    </div>
                    <div className={cx("clear")}></div>
                  </div>
                </Link>
              ))}
            </div>

            <div className={cx("col", "col-one-third", "news-right")}>
              <div className={cx("news-hot")}>
                <div className={cx("font-weight700")}>
                  Bài viết được xem nhiều nhất
                </div>
                {topview.map((news) => (
                  <div>
                    <Link
                      className={cx("link")}
                      key={news.idtt}
                      to={`/news/news-detail/${news.idtt}`}
                      onClick={() => increaseViewNews(news.idtt)}
                    >
                      {news.tieude}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className={cx("clear")}></div>
      </div>
    </GlobalStyles>
  );
}
