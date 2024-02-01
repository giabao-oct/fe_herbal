import React, { useState, useEffect, useRef } from "react";
import baseURL from "../utils/httpRequest.js";
import { Helmet } from "react-helmet";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import classnames from "classnames/bind";
import style from "../components/assets/styles/Profile.module.scss";
import GlobalStyles from "../components/assets/GlobalStyles";

const cx = classnames.bind(style);

export default function Profile() {
  const avtImg = document.getElementById("avt-img");
  const [acc, setAcc] = useState("");
  const [avt, setAvt] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [tendn, setTendn] = useState("");
  const [hoten, setHoten] = useState("");
  const [sdt, setSdt] = useState("");
  const [email, setEmail] = useState("");
  const [gioitinh, setGioitinh] = useState("Nam");
  const [diachi, setDiachi] = useState("");
  const [editing, setEditing] = useState(false);
  const inputFileRef = useRef(null);
  const iduser = Cookies.get("id");
  const handleEditClick = () => {
    setEditing(true);
  };

  const handleImageClick = () => {
    inputFileRef.current.click();
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvt(imageUrl);
      setEditing(true);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${baseURL}account-detail/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ iduser }),
      });

      const data = await response.json();
      setAcc(data);
      setImagePath(data.avt);
      setTendn(data.tendn);
      setHoten(data.hoten);
      setGioitinh(data.gioitinh);
      setSdt(data.sdt);
      setEmail(data.email);
      setDiachi(data.diachi);
      Cookies.set("avt", data.avt);
      Cookies.set("username", data.tendn);
    } catch (error) {
      console.error("Error fetching account details:", error);
    }
  };

  const handleSaveClick = async () => {
    let urls = [];
    if (avt.length > 0) {
      urls = await uploadFiles(avtImg.files);
    } else {
      urls.push(imagePath);
    }
    const concatenatedUrls = urls.join(",");

    const data = {
      avt: concatenatedUrls,
      tendn: tendn,
      hoten: hoten,
      gioitinh: gioitinh,
      sdt: sdt,
      email: email,
      diachi: diachi,
    };

    try {
      const response = await fetch(`${baseURL}update-account/${iduser}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${JSON.stringify(errorData)}`);
        return;
      }

      const responseData = await response.json();
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Cập nhật thành công",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } catch (error) {
      console.error("Error:", error);
    }
    setEditing(false);
    fetchData();
  };

  //upload ảnh lên cloudinary
  const uploadFiles = async (files) => {
    if (files) {
      const CLOUD_NAME = "dscipc01t";
      const PRESET_NAME = "herbal-upload";
      const FOLDER_NAME = "Account";
      const urls = [];
      const api = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

      const formData = new FormData();
      formData.append("upload_preset", PRESET_NAME);
      formData.append("folder", FOLDER_NAME);
      for (const file of files) {
        formData.append("file", file);
        const response = await axios.post(api, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        urls.push(response.data.secure_url);
      }
      return urls;
    }
  };

  return (
    <GlobalStyles>
      <div>
        <Helmet>
          <title>Thông tin cá nhân</title>
        </Helmet>
      </div>
      {/* <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <div className={cx("container-top")}>
            <div className={cx("container-left", "col", "thirty-five-percent")}>
              <div className={cx("avatar")}>
                <input
                  type="file"
                  accept="image/*"
                  ref={inputFileRef}
                  id="avt-img"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                {editing ? (
                  <img
                    src={avt || imagePath}
                    alt="avatar"
                    onClick={handleImageClick}
                  />
                ) : (
                  <img src={acc.avt} alt="avatar" />
                )}
              </div>
            </div>
            <div className={cx("container-right", "col", "sixty-five-percent")}>
              <div className={cx("profile")}>
                <div>
                  <strong>Tên đăng nhập: </strong>

                  {editing ? (
                    <input
                      type="text"
                      placeholder="Tên đăng nhập"
                      required
                      value={tendn}
                      onChange={(e) => setTendn(e.target.value)}
                    ></input>
                  ) : (
                    <span>{acc.tendn}</span>
                  )}
                </div>
                <div>
                  <strong> Họ tên: </strong>

                  {editing ? (
                    <input
                      type="text"
                      placeholder="Họ tên"
                      required
                      value={hoten}
                      onChange={(e) => setHoten(e.target.value)}
                    ></input>
                  ) : (
                    <span>{acc.hoten}</span>
                  )}
                </div>
                <div>
                  <strong> Giới tính: </strong>
                  {editing ? (
                    <select
                      value={gioitinh}
                      onChange={(e) => setGioitinh(e.target.value)}
                    >
                      <option>Nam</option>
                      <option>Nữ</option>
                      <option>Khác</option>
                    </select>
                  ) : (
                    <span>{acc.gioitinh}</span>
                  )}
                </div>
              </div>
            </div>
            <div className={cx("clear")}></div>
          </div>

          <div className={cx("container-mid")}>
            <div>
              <div>
                <strong> Số điện thoại: </strong>
                {editing ? (
                  <input
                    type="text"
                    placeholder="Số điện thoại"
                    required
                    value={sdt}
                    onChange={(e) => setSdt(e.target.value)}
                  />
                ) : (
                  <span>{acc.sdt}</span>
                )}
              </div>
              <div>
                <strong>Email: </strong>
                {editing ? (
                  <input
                    type="text"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                ) : (
                  <span>{acc.email}</span>
                )}
              </div>
              <div>
                <strong>Địa chỉ: </strong>
                {editing ? (
                  <input
                    type="text"
                    placeholder="Địa chỉ"
                    required
                    value={diachi}
                    onChange={(e) => setDiachi(e.target.value)}
                  />
                ) : (
                  <span>{acc.diachi}</span>
                )}
              </div>
            </div>
          </div>
          <div className={cx("container-bottom")}>
            {editing ? (
              <button onClick={handleSaveClick}>Lưu</button>
            ) : (
              <button onClick={handleEditClick}>Chỉnh sửa</button>
            )}
          </div>
        </div>
      </div> */}

      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <div className={cx("imgbox")}>
            <div className={cx("avatar")}>
              <input
                type="file"
                accept="image/*"
                ref={inputFileRef}
                id="avt-img"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              {editing ? (
                <div onClick={handleImageClick}>
                  <div className={cx("container-edit-img")}>
                    <div className={cx("edit-img")}>
                      <i class="fa-solid fa-pen"></i>
                      <span>Edit</span>
                    </div>
                  </div>
                  <img src={avt || imagePath} alt="avatar" />
                </div>
              ) : (
                <img src={acc.avt} alt="avatar" />
              )}
              <div className={cx("clear")}></div>
            </div>
          </div>
          <div className={cx("content")}>
            <div className={cx("profile")}>
              <div>
                <strong>Tên đăng nhập: </strong>

                {editing ? (
                  <input
                    type="text"
                    placeholder="Tên đăng nhập"
                    required
                    value={tendn}
                    onChange={(e) => setTendn(e.target.value)}
                  ></input>
                ) : (
                  <span>{acc.tendn}</span>
                )}
              </div>
              <div>
                <strong> Họ tên: </strong>

                {editing ? (
                  <input
                    type="text"
                    placeholder="Họ tên"
                    required
                    value={hoten}
                    onChange={(e) => setHoten(e.target.value)}
                  ></input>
                ) : (
                  <span>{acc.hoten}</span>
                )}
              </div>
              <div>
                <strong> Giới tính: </strong>
                {editing ? (
                  <select
                    value={gioitinh}
                    onChange={(e) => setGioitinh(e.target.value)}
                  >
                    <option>Nam</option>
                    <option>Nữ</option>
                    <option>Khác</option>
                  </select>
                ) : (
                  <span>{acc.gioitinh}</span>
                )}
              </div>
              <div>
                <strong> Số điện thoại: </strong>
                {editing ? (
                  <input
                    type="text"
                    placeholder="Số điện thoại"
                    required
                    value={sdt}
                    onChange={(e) => setSdt(e.target.value)}
                  />
                ) : (
                  <span>{acc.sdt}</span>
                )}
              </div>
              <div>
                <strong>Email: </strong>
                {editing ? (
                  <input
                    type="text"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                ) : (
                  <span>{acc.email}</span>
                )}
              </div>
              <div>
                <strong>Địa chỉ: </strong>
                {editing ? (
                  <input
                    type="text"
                    placeholder="Địa chỉ"
                    required
                    value={diachi}
                    onChange={(e) => setDiachi(e.target.value)}
                  />
                ) : (
                  <span>{acc.diachi}</span>
                )}
              </div>
              <div className={cx("button-edit")}>
                {editing ? (
                  <button onClick={handleSaveClick}>Lưu</button>
                ) : (
                  <button onClick={handleEditClick}>Chỉnh sửa</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlobalStyles>
  );
}
