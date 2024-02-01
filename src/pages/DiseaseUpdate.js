import React, { useState, useEffect } from "react";
import baseURL from "../utils/httpRequest.js";
import { useHistory } from "react-router-dom";
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
import classnames from "classnames/bind";
import style from "../components/assets/styles/Update.module.scss";
import GlobalStyles from "../components/assets/GlobalStyles";

const cx = classnames.bind(style);

const DiseaseUpdate = () => {
  const diseaseImg = document.getElementById("disease-img");
  const [tenbenh, setTenbenh] = useState("");
  const [imagePaths, setImagePaths] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const history = useHistory();
  const currentUrl = window.location.href;
  const regex = /\/(\d+)$/;
  const match = currentUrl.match(regex);
  const idbenh = match ? match[1] : null;

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
        const response = await fetch(`${baseURL}disease-detail/${idbenh}/`);

        const data = await response.json();

        setTenbenh(data.tenbenh);
        setImagePaths(data.anhbenh);
        const htmlData = data.noidung;
        const blocksFromHTML = convertFromHTML(htmlData);
        const contentState = ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        );
        setEditorState(EditorState.createWithContent(contentState));
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchData();
  }, [idbenh]);

  const handleSaveDisease = async () => {
    if (!diseaseImg.files || imagePaths === "") {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Vui lòng chọn một ảnh của bệnh.",
      });
      return;
    }

    const htmlContent = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    let urls = [];
    if (selectedImages.length > 0) {
      urls = await uploadFiles(diseaseImg.files);
    } else {
      urls.push(imagePaths);
    }
    // const urls = await uploadFiles(diseaseImg.files);
    const concatenatedUrls = urls.join(",");

    const data = {
      tenbenh: tenbenh,
      anhbenh: concatenatedUrls,
      noidung: htmlContent,
    };

    try {
      const response = await fetch(`${baseURL}update-disease/${idbenh}/`, {
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
        text: responseData,
      }).then((result) => {
        if (result.isConfirmed) {
          history.push("/disease-management");
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
      const FOLDER_NAME = "Disease";
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

  const handleImageChange = (e) => {
    if (imagePaths.length > 0) {
      setImagePaths([]);
      return;
    }
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  //xoá ảnh
  const handleDeleteImage = (index) => {
    setImagePaths([]);
  };

  return (
    <GlobalStyles>
      <div>
        <Helmet>
          <title>Cập nhật bệnh cảm</title>
        </Helmet>
      </div>
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <div className={cx("title")}>SỬA BỆNH CẢM</div>

          <div className={cx("input-field")}>
            <label>Tên bệnh cảm</label>
            <input
              type="text"
              placeholder="Tên bệnh cảm"
              required
              value={tenbenh}
              onChange={(e) => setTenbenh(e.target.value)}
            />
          </div>
          <div className={cx("input-field")}>
            <label>Ảnh bệnh</label>
            <input
              type="file"
              id="disease-img"
              onChange={handleImageChange}
              disabled={imagePaths.length > 0}
            />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {imagePaths && (
              <div style={{ position: "relative" }}>
                <img
                  src={imagePaths}
                  style={{ width: "500px", height: "auto", margin: "5px" }}
                />
                <div
                  className={cx("delete-img")}
                  onClick={handleDeleteImage}
                  style={{ position: "absolute", top: 0, right: 0 }}
                >
                  <i className="fa-solid fa-xmark"></i>
                </div>
              </div>
            )}
            {selectedImages.map((image, index) => (
              <img
                key={index}
                src={URL.createObjectURL(image)}
                alt={`Preview ${index + 1}`}
                style={{ width: "500px", height: "auto", margin: "5px" }}
              />
            ))}
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
            <button onClick={handleSaveDisease}>
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
export default DiseaseUpdate;
