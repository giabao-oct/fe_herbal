import React, { useState, useEffect } from "react";
import baseURL from "../utils/httpRequest.js";
import { Helmet } from "react-helmet";
import axios from "axios";
import classnames from "classnames/bind";
import style from "../components/assets/styles/About.module.scss";
import GlobalStyles from "../components/assets/GlobalStyles";

const cx = classnames.bind(style);

export default function About() {
  return (
    <GlobalStyles>
      <div>
        <Helmet>
          <title>Về chúng tôi</title>
        </Helmet>
      </div>
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <div className={cx("content")}>
            Chúng tôi là những sinh viên của Trường Đại học Công Thương Thành
            phố Hồ Chí Minh. Với niềm đam mê về công nghệ và y học, chúng tôi đã
            lựa chọn đề tài "Xây dựng ứng dụng nhận diện lá cây thuốc điều trị
            bệnh cảm" cho khóa luận tốt nghiệp đại học của mình. Chúng tôi là
            những người trẻ, tràn đầy năng lượng và nhiệt huyết. Chúng tôi luôn
            mong muốn được đóng góp một phần sức lực của mình cho xã hội. Chúng
            tôi tin rằng ứng dụng nhận diện lá cây thuốc điều trị bệnh cảm sẽ là
            một công cụ hữu ích cho người dân, giúp họ dễ dàng tiếp cận với các
            loại thuốc nam tự nhiên, an toàn và hiệu quả. Để thực hiện đề tài
            này, chúng tôi đã tiến hành nghiên cứu kỹ lưỡng về các loại cây
            thuốc có tác dụng điều trị bệnh cảm. Chúng tôi đã xây dựng một cơ sở
            dữ liệu về đặc điểm hình thái của các loại lá cây thuốc này. Đồng
            thời, chúng tôi cũng đã phát triển một thuật toán nhận diện lá cây
            thuốc dựa trên trí tuệ nhân tạo. Chúng tôi tin rằng ứng dụng nhận
            diện lá cây thuốc điều trị bệnh cảm sẽ là một sản phẩm có giá trị
            thực tiễn cao. Ứng dụng này sẽ giúp người dân nâng cao kiến thức về
            cây thuốc, đồng thời hỗ trợ họ trong việc điều trị bệnh cảm một cách
            hiệu quả và an toàn.
          </div>
        </div>
      </div>
    </GlobalStyles>
  );
}
