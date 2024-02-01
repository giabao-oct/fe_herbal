import React, { useState, useEffect } from "react";
import baseURL from "../utils/httpRequest.js";
import { Helmet } from "react-helmet";
import { useHistory, useLocation, Link } from "react-router-dom";
import Cookies from "js-cookie";
import moment from "moment";
import classnames from "classnames/bind";
import style from "../components/assets/styles/PurchaseHistory.module.scss";
import GlobalStyles from "../components/assets/GlobalStyles";

const cx = classnames.bind(style);

export default function PurchaseHistory() {
  const [invoices, setInvoices] = useState([]);
  const iduser = Cookies.get("id");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${baseURL}get-list-order/${iduser}`);
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setInvoices(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const formatCurrency = (amount, locale = "vi-VN", currency = "VND") => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(amount);
  };
  return (
    <GlobalStyles>
      <div>
        <Helmet>
          <title>Lịch sử mua hàng</title>
        </Helmet>
      </div>
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <div className={cx("")}>
            <div className={cx("title")}>LỊCH SỬ MUA HÀNG</div>
            <div className={cx("")}>
              {invoices.map((invoice) => (
                <div className={cx("container-products")} key={invoice.id}>
                  <div>
                    <div className={cx("col", "col-two", "date")}>
                      Ngày đặt hàng:
                      <span>
                        {moment(invoice.ngaylap).format("YYYY-MM-DD HH:mm:ss")}
                      </span>
                    </div>
                    <div className={cx("col", "col-two", "total")}>
                      Tổng tiền:<span>{formatCurrency(invoice.tongtien)}</span>
                    </div>
                    <div className={cx("line")}>
                      <hr />
                    </div>
                    <div className={cx("name-products")}>
                      <div className={cx("col", "col-two")}>Sản phẩm</div>
                      <div className={cx("col", "col-two")}>
                        <div className={cx("col", "col-three")}> Đơn giá</div>
                        <div className={cx("col", "col-three")}> Số lượng</div>
                        <div className={cx("col", "col-three")}>Thành tiền</div>
                      </div>
                      <div className={cx("clear")}></div>
                    </div>
                    <div className={cx("products")}>
                      {invoice.chitietsanpham.map((product) => (
                        <div
                          key={product.id}
                          className={cx("card-product", "df-center")}
                        >
                          <div
                            className={cx(
                              "col",
                              "col-two",
                              "df-center",
                              "product-left"
                            )}
                          >
                            <Link
                              className={cx("col", "col-full", "df-center")}
                              to={`/products/product-detail/${product.idsp}`}
                            >
                              <div className={cx("col", "col-four")}>
                                <img
                                  src={product.anhsp.split(",")[0]}
                                  alt="product"
                                />
                              </div>
                              <div className={cx("col", "three-quarters")}>
                                {product.tensp}
                              </div>
                            </Link>
                          </div>
                          <div
                            className={cx(
                              "col",
                              "col-two",
                              "df-center",
                              "product-right"
                            )}
                          >
                            <div
                              className={cx("col", "col-three", "df-center")}
                            >
                              {formatCurrency(product.giaban)}
                            </div>
                            <div
                              className={cx(
                                "col",
                                "col-three",
                                "df-center",
                                "button"
                              )}
                            >
                              <div className={cx("quantity")}>
                                {product.soluong}
                              </div>
                            </div>
                            <div
                              className={cx("col", "col-three", "df-center")}
                            >
                              {formatCurrency(product.giaban * product.soluong)}
                            </div>
                          </div>
                          <div className={cx("clear")}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <div className={cx("clear")}></div>
            </div>
          </div>
        </div>
      </div>
    </GlobalStyles>
  );
}
