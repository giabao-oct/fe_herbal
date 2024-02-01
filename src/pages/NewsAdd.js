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

const NewsAdd = () => {
  const newsImg = document.getElementById("news-img");
  const [tieude, setTieude] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [mota, setMota] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const history = useHistory();

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const uploadFiles = async (files) => {
    if (files) {
      const CLOUD_NAME = "dscipc01t";
      const PRESET_NAME = "herbal-upload";
      const FOLDER_NAME = "News";
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

  const handleSaveNews = async () => {
    if (!newsImg.files || newsImg.files.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Vui lòng chọn ít nhất một ảnh của tin tức.",
      });
      return;
    }

    const htmlContent = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    const urls = await uploadFiles(newsImg.files);
    const concatenatedUrls = urls.join(",");
    const data = {
      tieude: tieude,
      anhtt: concatenatedUrls,
      mota: mota,
      noidung: htmlContent,
    };

    try {
      const response = await fetch(`${baseURL}add-news/`, {
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
          history.push("/news-management");
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Thất bại",
        text: "Thêm tin tức thất bại!",
      });
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
              style={{ width: "500px", height: "auto", margin: "5px" }}
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
          <title>Thêm tin tức</title>
        </Helmet>
      </div>
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <div className={cx("title")}>THÊM TIN TỨC</div>
          <div className={cx("input-field")}>
            <label>Tiêu đề</label>
            <input
              type="text"
              placeholder="Tiêu đề"
              required
              value={tieude}
              onChange={(e) => setTieude(e.target.value)}
            />
          </div>
          <div className={cx("input-field")}>
            <label>Ảnh tin tức</label>
            <input type="file" id="news-img" onChange={handleImageChange} />
            <ImagePreview selectedImages={selectedImages} />
          </div>
          <div className={cx("input-field")}>
            <label>Mô tả</label>
            <textarea
              placeholder="Mô tả"
              required
              value={mota}
              onChange={(e) => setMota(e.target.value)}
            ></textarea>
          </div>
          <div className={cx("input-field")}>
            <label>Nội dung</label>
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
          <div className={cx("bt-save")}>
            <button onClick={handleSaveNews}>
              <span>
                <i class="fa-regular fa-square-plus"></i>
              </span>
              <span>Thêm tin tức</span>
            </button>
          </div>
        </div>
      </div>
      <div className={cx("clear")}></div>
    </GlobalStyles>
  );
};
export default NewsAdd;
