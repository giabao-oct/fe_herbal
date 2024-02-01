import React, { useState, useRef, useEffect } from "react";
import baseURL from "../utils/httpRequest.js";
import { useHistory, Link } from "react-router-dom";

import Cookies from "js-cookie";
import { useSelector, useDispatch } from "react-redux";
import classname from "classnames/bind";
import axios from "axios";
import Modal from "./Modal";
import style from "./assets/styles/HeaderComponent.module.scss";
import GlobalStyles from "./assets/GlobalStyles";

const cx = classname.bind(style);

export default function HeaderComponent() {
  const [openModal, setOpenModal] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  // const [showDropdown, setShowDropdown] = useState(false);
  // const [searchResult, setSearchResult] = useState([]);
  // const [suggestions, setSuggestions] = useState([]);
  const history = useHistory();
  const count = useSelector((state) => state.count);
  const dispatch = useDispatch();
  const iduser = Cookies.get("id");
  const [searchInput, setSearchInput] = useState("");

  //modal
  const [modal] = useState(false);

  useEffect(() => {
    if (modal) {
      document.body.classList.add("active-modal");
    } else {
      document.body.classList.remove("active-modal");
    }

    return () => {
      document.body.classList.remove("active-modal");
    };
  }, [modal]);

  //login
  useEffect(() => {
    if (iduser) {
      setLoggedIn(true);
      const savedUserInfo = {
        id: Cookies.get("id"),
        avt: Cookies.get("avt"),
        username: Cookies.get("username"),
        role: Cookies.get("role"),
      };
      setUserInfo(savedUserInfo);
      countProduct();
    }
  }, []);

  const countProduct = async () => {
    try {
      const response = await axios.get(`${baseURL}count-product/${iduser}/`);
      dispatch({ type: "UPDATE_COUNT", payload: response.data.count });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${baseURL}product-suggestions/?tensp=${searchInput}`
  //       );
  //       setSearchResult(response.data);
  //       console.log("searchResult:", searchResult);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, [searchInput]);

  const handleSearchClick = () => {
    history.push(`/products?search=${searchInput}`);
  };

  const handleSearchEnter = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    // const filteredSuggestions = searchResult.filter((product) =>
    //   product.tensp.toLowerCase().includes(value.toLowerCase())
    // );
    // setSuggestions(filteredSuggestions);
    // setShowDropdown(true);
  };

  // const handleSuggestionClick = (suggestion) => {
  //   setSearchInput(suggestion.tensp);
  //   setSuggestions([]);
  //   setShowDropdown(false);
  // };

  const handleLogout = () => {
    Cookies.remove("id");
    Cookies.remove("avt");
    Cookies.remove("username");
    Cookies.remove("role");
    setLoggedIn(false);
    // window.location.reload();
    history.push("/");
  };

  return (
    <GlobalStyles>
      <header className={cx("header")}>
        <div className={cx("wrapper")}>
          <div className={cx("container")}>
            <div className={cx("header-left")}>
              <div className={cx("logo")}>
                <Link to="/">
                  <img src={require("./assets/img/herbal.jpg")} />
                </Link>
              </div>

              <div className={cx("menu")}>
                <ul className={cx("nav")}>
                  <li>
                    <Link to="/" className={cx("link")}>
                      Trang chủ
                    </Link>
                  </li>
                  <li>
                    <Link to="/products" className={cx("link")}>
                      Sản phẩm
                    </Link>
                  </li>
                  <li>
                    <Link to="/news" className={cx("link")}>
                      Tin tức
                    </Link>
                  </li>
                  <li>
                    <Link to="/disease" className={cx("link")}>
                      Bệnh cảm
                    </Link>
                  </li>
                  {/* <li>
                    <Link to="/about" className={cx("link")}>
                      Về chúng tôi
                    </Link>
                  </li> */}
                </ul>
              </div>
            </div>

            <div className={cx("header-right")}>
              <div className={cx("search-all")}>
                <div className={cx("search")}>
                  <div className={cx("search-icon")}>
                    <form>
                      <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        name="search"
                        value={searchInput}
                        onChange={handleSearchChange}
                        onKeyDown={handleSearchEnter}
                        // onFocus={() => setShowDropdown(true)}
                        // onBlur={() => setShowDropdown(false)}
                      />
                      <div className={cx("submit")} onClick={handleSearchClick}>
                        <i class="fa fa-search"></i>
                      </div>
                    </form>
                    {/* {showDropdown && searchInput.trim() !== "" && (
                      <div className={cx("dropdown-search")}>
                        <div className={cx("dropwn-search-container")}>
                          {suggestions.length > 0 &&
                            searchInput.trim() !== "" && (
                              <ul>
                                {suggestions.map((sanpham) => (
                                  <li
                                    key={sanpham.idsp}
                                    onClick={() =>
                                      handleSuggestionClick(sanpham)
                                    }
                                  >
                                    {sanpham.tensp}
                                  </li>
                                ))}
                              </ul>
                            )}
                        </div>
                      </div>
                    )} */}
                  </div>

                  <div className={cx("clear")}></div>
                </div>

                <div className={cx("search-img")}>
                  <div
                    className={cx("image-container")}
                    onClick={() => setOpenModal(true)}
                  >
                    <div>
                      <img src={require("./assets/img/cameraAdd.png")}></img>
                      Tìm kiếm bằng hình ảnh
                    </div>
                  </div>
                  <Modal open={openModal} onClose={() => setOpenModal(false)} />
                </div>
              </div>

              <div className={cx("bt-container")}>
                <div>
                  {loggedIn ? (
                    <>
                      {userInfo.role === "user" ? (
                        <div className={cx("user")}>
                          <div className={cx("cart")}>
                            <Link to="/cart">
                              {count === 0 ? null : <span>{count}</span>}

                              <i class="fa-solid fa-cart-shopping"></i>
                            </Link>
                          </div>
                          <div className={cx("dropdown")}>
                            <div className={cx("dropbtn")}>
                              <img src={userInfo.avt} />
                              <span>Xin chào, {userInfo.username}</span>
                            </div>
                            <div class={cx("dropdown-content")}>
                              <Link to="/profile">Thông tin tài khoản</Link>
                              <Link to="/purchase-history">
                                Lịch sử mua hàng
                              </Link>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className={cx("admin")}>
                          <div className={cx("dropdown")}>
                            <div className={cx("dropbtn")}>
                              <img src={userInfo.avt} />
                              <span>Xin chào, {userInfo.username}</span>
                            </div>
                            <div class={cx("dropdown-content")}>
                              <Link to="/profile">Thông tin tài khoản</Link>
                              <Link to="/account-management">
                                Quản lý tài khoản
                              </Link>
                              <Link to="/product-management">
                                Quản lý sản phẩm
                              </Link>
                              <Link to="/receipt-management">
                                Quản lý nhập hàng
                              </Link>
                              <Link to="/disease-management">Quản lý bệnh</Link>
                              <Link to="/news-management">Quản lý tin tức</Link>
                              <Link to="/order-management">
                                Quản lý đơn hàng
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className={cx("logout")} onClick={handleLogout}>
                        <i class="fa-solid fa-arrow-right-from-bracket"></i>
                        <div class={cx("tooltiptext")}>Đăng xuất</div>
                      </div>
                    </>
                  ) : (
                    <div style={{ display: loggedIn ? "none" : "block" }}>
                      <Link to="/login">
                        <button className={cx("login")}>Đăng nhập</button>
                      </Link>
                      <Link to="/register">
                        <button className={cx("register")}>Đăng ký</button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </GlobalStyles>
  );
}
