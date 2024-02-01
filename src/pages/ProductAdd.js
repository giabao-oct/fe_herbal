import React, { useState, useEffect } from "react";
import baseURL from "../utils/httpRequest.js";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import classnames from "classnames/bind";
import style from "../components/assets/styles/Add.module.scss";
import GlobalStyles from "../components/assets/GlobalStyles";

const cx = classnames.bind(style);

const ProductAdd = () => {
  const productImg = document.getElementById("product-img");
  const [tensp, setTensp] = useState("");
  const [tenkhac, setTenkhac] = useState("");
  const [tenkhoahoc, setTenkhoahoc] = useState("");
  const [congdung, setCongdung] = useState("");
  const [baithuoc, setBaithuoc] = useState("");
  const [giaban, setGiaban] = useState("");
  // const [SLton, setSlton] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const history = useHistory();

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const uploadFiles = async (files) => {
    if (files) {
      const CLOUD_NAME = "dscipc01t";
      const PRESET_NAME = "herbal-upload";
      const FOLDER_NAME = "Product";
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

  const handleSaveProduct = async () => {
    if (!productImg.files || productImg.files.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Vui lòng chọn ít nhất một ảnh sản phẩm.",
      });
      return;
    }
    if (!isNumber(giaban)) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Giá bán không hợp lệ! Vui lòng chỉ nhập số vào hai giá trị này.",
      });
      return;
    }

    const htmlContent = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    const urls = await uploadFiles(productImg.files);
    const concatenatedUrls = urls.join(",");
    const data = {
      anhsp: concatenatedUrls,
      tensp: tensp,
      tenkhac: tenkhac,
      tenkhoahoc: tenkhoahoc,
      congdung: congdung,
      mota: htmlContent,
      baithuoc: baithuoc.replace(/\n/g, "<br>"),
      giaban: giaban,
      // SLton: SLton,
    };

    try {
      const response = await fetch(`${baseURL}add-product/`, {
        method: "POST",
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
        text: responseData,
      }).then((result) => {
        if (result.isConfirmed) {
          history.push("/product-management");
        }
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const ImagePreview = ({ selectedImages }) => {
    return (
      <div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {selectedImages.map((image, index) => (
            <img
              key={index}
              src={URL.createObjectURL(image)}
              alt={`Preview ${index + 1}`}
              style={{ width: "100px", height: "100px", margin: "5px" }}
            />
          ))}
        </div>
      </div>
    );
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  //kiểm tra input nhập số
  const isNumber = (value) => {
    return /^\d+$/.test(value);
  };

  useEffect(() => {
    const role = Cookies.get("role");

    if (role !== "admin") {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Bạn không có quyền truy cập trang này.",
      }).then((result) => {
        if (result.isConfirmed) {
          history.push("/");
        }
      });
    }
  }, []);

  return (
    <GlobalStyles>
      <div>
        <Helmet>
          <title>Thêm sản phẩm</title>
        </Helmet>
      </div>
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <div className={cx("title")}>THÊM SẢN PHẨM</div>
          <div className={cx("input-field")}>
            <label>Ảnh sản phẩm</label>
            <input
              type="file"
              multiple
              id="product-img"
              onChange={handleImageChange}
            />
            <ImagePreview selectedImages={selectedImages} />
          </div>
          <div className={cx("input-field")}>
            <label>Tên sản phẩm</label>
            <input
              type="text"
              placeholder="Tên sản phẩm"
              required
              value={tensp}
              onChange={(e) => setTensp(e.target.value)}
            />
          </div>
          <div className={cx("input-field")}>
            <label>Tên khác</label>
            <input
              type="text"
              placeholder="Tên khác"
              required
              value={tenkhac}
              onChange={(e) => setTenkhac(e.target.value)}
            />
          </div>
          <div className={cx("input-field")}>
            <label>Tên khoa học</label>
            <input
              type="text"
              placeholder="Tên khoa học"
              required
              value={tenkhoahoc}
              onChange={(e) => setTenkhoahoc(e.target.value)}
            />
          </div>
          <div className={cx("input-field")}>
            <label>Công dụng</label>
            <input
              type="text"
              placeholder="Công dụng"
              required
              value={congdung}
              onChange={(e) => setCongdung(e.target.value)}
            />
          </div>
          <div className={cx("input-field")}>
            <label>Mô tả</label>
            <div className={cx("editor")}>
              <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName={cx("wrapperClassName")}
                editorClassName={cx("editorClassName")}
                onEditorStateChange={onEditorStateChange}
              />
            </div>
          </div>
          <div className={cx("input-field")}>
            <label>Bài thuốc</label>
            <textarea
              placeholder="Bài thuốc"
              required
              value={baithuoc}
              onChange={(e) => setBaithuoc(e.target.value)}
            ></textarea>
          </div>
          <div className={cx("input-field")}>
            <label>Giá bán</label>
            <input
              type="text"
              placeholder="Giá bán"
              required
              value={giaban}
              onChange={(e) => setGiaban(e.target.value)}
            />
          </div>
          {/* <div className={cx("input-field")}>
            <label>Số lượng</label>
            <input
              type="text"
              placeholder="Số lượng"
              required
              value={SLton}
              onChange={(e) => setSlton(e.target.value)}
            />
          </div> */}
          <div className={cx("bt-save")}>
            <button onClick={handleSaveProduct}>
              <span>
                <i class="fa-regular fa-square-plus"></i>
              </span>
              <span>Thêm sản phẩm</span>
            </button>
          </div>
        </div>
      </div>
      <div className={cx("clear")}></div>
    </GlobalStyles>
  );
};
export default ProductAdd;
