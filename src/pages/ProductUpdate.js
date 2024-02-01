import React, { useState, useEffect } from "react";
import baseURL from "../utils/httpRequest.js";
import { Helmet } from "react-helmet";
import { Editor } from "react-draft-wysiwyg";
import {
  EditorState,
  ContentState,
  convertFromHTML,
  convertToRaw,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import classnames from "classnames/bind";
import style from "../components/assets/styles/Update.module.scss";
import GlobalStyles from "../components/assets/GlobalStyles";

const cx = classnames.bind(style);

const ProductUpdate = () => {
  const productImg = document.getElementById("product-img");
  const [tensp, setTensp] = useState("");
  const [tenkhac, setTenkhac] = useState("");
  const [tenkhoahoc, setTenkhoahoc] = useState("");
  const [congdung, setCongdung] = useState("");
  const [baithuoc, setBaithuoc] = useState("");
  const [giaban, setGiaban] = useState("");
  const [SLton, setSLton] = useState("");
  const [imagePaths, setImagePaths] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const history = useHistory();
  const currentUrl = window.location.href;
  const regex = /\/(\d+)$/;
  const match = currentUrl.match(regex);
  const idsp = match ? match[1] : null;

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
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
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseURL}product-detail/${idsp}/`);

        const data = await response.json();
        const pathsArray = data.anhsp.split(",").map((path) => path.trim());
        setImagePaths(pathsArray);

        setTensp(data.tensp);
        setTenkhac(data.tenkhac);
        setTenkhoahoc(data.tenkhoahoc);
        setCongdung(data.congdung);

        const htmlData = data.mota;
        const blocksFromHTML = convertFromHTML(htmlData);
        const contentState = ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        );
        setEditorState(EditorState.createWithContent(contentState));

        setBaithuoc(data.baithuoc);
        setGiaban(data.giaban);
        setSLton(data.SLton);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchData();
  }, [idsp]);

  const handleSaveProduct = async () => {
    if (!productImg.files || !imagePaths || imagePaths.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Vui lòng chọn ít nhất một ảnh sản phẩm.",
      });
      return;
    }
    if (!isNumber(giaban) || !isNumber(SLton)) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Giá bán và số lượng không hợp lệ! Vui lòng chỉ nhập số vào hai giá trị này.",
      });
      return;
    }

    const htmlContent = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    const urls = await uploadFiles(productImg.files);
    const allUrls = [...imagePaths, ...urls];
    const concatenatedUrls = allUrls.join(",");
    console.log("Concatenated URLs:", concatenatedUrls);

    const data = {
      anhsp: concatenatedUrls,
      tensp: tensp,
      tenkhac: tenkhac,
      tenkhoahoc: tenkhoahoc,
      congdung: congdung,
      mota: htmlContent,
      baithuoc: baithuoc.replace(/\n/g, "<br>"),
      giaban: giaban,
      SLton: SLton,
    };

    try {
      const response = await fetch(`${baseURL}update-product/${idsp}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

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

  //upload ảnh lên cloudinary
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

  //kiểm tra input nhập số
  const isNumber = (value) => {
    return /^\d+$/.test(value);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  //xoá ảnh
  const handleDeleteImage = (index) => {
    const updatedPaths = [...imagePaths];
    updatedPaths.splice(index, 1);
    setImagePaths(updatedPaths);
  };

  return (
    <GlobalStyles>
      <div>
        <Helmet>
          <title>Cập nhật sản phẩm</title>
        </Helmet>
      </div>
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <div className={cx("title")}>SỬA SẢN PHẨM</div>
          <div className={cx("input-field")}>
            <label>Ảnh sản phẩm</label>
            <input
              type="file"
              multiple
              id="product-img"
              onChange={handleImageChange}
            />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {imagePaths.map((path, index) => (
              <div key={index} style={{ position: "relative" }}>
                <img
                  src={path.trim()}
                  alt={`Preview ${index + 1}`}
                  style={{ width: "100px", height: "100px", margin: "5px" }}
                />
                <div
                  className={cx("delete-img")}
                  onClick={() => handleDeleteImage(index)}
                  style={{ position: "absolute", top: 0, right: 0 }}
                >
                  <i class="fa-solid fa-xmark"></i>
                </div>
              </div>
            ))}
            {selectedImages.map((image, index) => (
              <img
                key={index}
                src={URL.createObjectURL(image)}
                alt={`Preview ${index + 1}`}
                style={{ width: "100px", height: "100px", margin: "5px" }}
              />
            ))}
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
          <div className={cx("input-field")}>
            <label>Số lượng</label>
            <input
              type="text"
              placeholder="Số lượng"
              required
              disabled
              value={SLton}
              onChange={(e) => setSLton(e.target.value)}
            />
          </div>
          <div className={cx("bt-save")}>
            <button onClick={handleSaveProduct}>
              <span>
                <i class="fa-regular fa-floppy-disk"></i>
              </span>
              <span>Lưu</span>
            </button>
          </div>
        </div>
      </div>
      <div className={cx("clear")}></div>
    </GlobalStyles>
  );
};
export default ProductUpdate;
