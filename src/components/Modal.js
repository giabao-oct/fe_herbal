import React, { useState, useRef, useEffect } from "react";
import baseURL from "../utils/httpRequest.js";
import axios from "axios";
import Swal from "sweetalert2";
import style from "./assets/styles/HeaderComponent.module.scss";
import classname from "classnames/bind";
const cx = classname.bind(style);

const Modal = ({ open, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [result, setResult] = useState("");
  const [isCameraOn, setIsCameraOn] = useState(false);
  const videoRef = useRef(null);
  const [activeTab, setActiveTab] = useState(1);

  // Image
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImageUrl(null);
    }
  };

  const handleSearch = () => {
    if (imageUrl === null) {
      Swal.fire({
        icon: "info",
        title: "Thông báo",
        text: "Vui lòng chọn hình ảnh để tìm kiếm",
      });
    }
    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);

      axios
        .post(`${baseURL}image-recognition/`, formData)
        .then((response) => {
          setResult(response.data.result);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };
  // Camera
  const startCamera = async () => {
    try {
      if (isCameraOn) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
        setIsCameraOn(false);
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({
          // video: true,
          video: {
            facingMode: "environment",
          },
        });
        videoRef.current.srcObject = stream;
        setIsCameraOn(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const captureImage = () => {
    if (!videoRef.current.srcObject) {
      Swal.fire({
        icon: "info",
        title: "Thông báo",
        text: "Vui lòng bật camera trước khi chụp ảnh.",
      });
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageUrl = canvas.toDataURL("image/png");
    setImageUrl(imageUrl);

    if (isCameraOn) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
      videoRef.current.srcObject = null;
      setIsCameraOn(false);
    }
  };

  const handleSearchCam = () => {
    if (imageUrl === null) {
      Swal.fire({
        icon: "info",
        title: "Thông báo",
        text: "Vui lòng chụp ảnh để tìm kiếm",
      });
    }
    if (imageUrl) {
      const formData = new FormData();
      const blob = dataURItoBlob(imageUrl);
      formData.append("image", blob, "image.png");

      axios
        .post(`${baseURL}image-recognition/`, formData)
        .then((response) => {
          setResult(response.data.result);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  // Hàm chuyển đổi dữ liệu base64 thành Blob
  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }
  //modal
  if (!open) return null;

  const handleClose = () => {
    // Tắt camera nếu đang bật trước khi đóng modal
    if (isCameraOn) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
      videoRef.current.srcObject = null;
      setIsCameraOn(false);
    }
    setImageUrl(null);
    setResult(null);
    onClose();
  };

  //tab
  const handleTabClick = (tabNumber) => {
    if (isCameraOn) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
      videoRef.current.srcObject = null;
      setIsCameraOn(false);
    }
    setImageUrl(null);
    setResult(null);
    setActiveTab(tabNumber);
  };

  return (
    <div onClick={handleClose} className={cx("overlay")}>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={cx("modalContainer")}
      >
        <div className={cx("modalRight")}>
          <div className="modal">
            <div
              className={cx("closeBtn")}
              onClick={handleClose}
              // onClick={onClose}
            >
              <i class="fa-solid fa-xmark"></i>
            </div>
          </div>

          <div className={cx("content")}>
            <div className={cx("tab-header")}>
              <div
                // className={`tab-item ${activeTab === 1 ? "active" : ""}`}
                className={cx("tab-item", { active: activeTab === 1 })}
                onClick={() => handleTabClick(1)}
              >
                <i class="fa-solid fa-image"></i> Image
              </div>
              <div
                // className={`tab-item ${activeTab === 2 ? "active" : ""}`}
                className={cx("tab-item", { active: activeTab === 2 })}
                onClick={() => handleTabClick(2)}
              >
                <i class="fa-solid fa-camera"></i> Camera
              </div>
            </div>
            <div className={cx("tab-content")}>
              {activeTab === 1 && (
                <div>
                  <div className={cx("preview-img")}>
                    {imageUrl ? (
                      <img src={imageUrl} alt="Uploaded Image" />
                    ) : (
                      <img
                        src={require("./assets/img/placeholder-image.jpg")}
                        alt="Image Placeholder"
                      />
                    )}
                    <div className={cx("result-img")}>
                      {result && (
                        <div className={cx("result")}>
                          <span>Kết quả:</span>
                          <div className={cx("resutl-text")}>{result}</div>
                          <a href={`/products?search=${result}`}>
                            Đi đến sản phẩm{" "}
                            <i class="fa-solid fa-arrow-right"></i>{" "}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 2 && (
                <div>
                  <div className={cx("preview-img")}>
                    <video ref={videoRef} autoPlay />
                    {imageUrl ? (
                      <img src={imageUrl} alt="Captured" />
                    ) : (
                      <img
                        src={require("./assets/img/placeholder-image.jpg")}
                        alt="Image Placeholder"
                      />
                    )}
                    <div className={cx("result-img")}>
                      {result && (
                        <div className={cx("result")}>
                          <span>Kết quả:</span>
                          <div className={cx("resutl-text")}>{result}</div>
                          <a href={`/products?search=${result}`}>
                            Đi đến sản phẩm{" "}
                            <i class="fa-solid fa-arrow-right"></i>{" "}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={cx("modal-footer")}>
            {activeTab === 1 && (
              <div className={cx("tab-footer")}>
                <div className={cx("footer-left")}>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    id="image-input"
                    onChange={handleFileChange}
                  />
                </div>
                <div className={cx("footer-right")}>
                  <button onClick={handleSearch}>Tìm kiếm</button>
                </div>
              </div>
            )}
            {activeTab === 2 && (
              <div className={cx("tab-footer")}>
                <div className={cx("footer-left")}>
                  <button onClick={startCamera}>
                    {isCameraOn ? "Tắt Camera" : "Bật Camera"}
                  </button>
                  <button onClick={captureImage}>Chụp ảnh</button>
                </div>
                <div className={cx("footer-right")}>
                  <button onClick={handleSearchCam}>Tìm kiếm</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
