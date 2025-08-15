<template>
  <footer>
    <div class="footer-container">
      <!-- Phần thông tin liên hệ -->
      <div class="contact-info">
        <h3>Thông tin liên hệ</h3>
        <p>Địa chỉ: phú diễn ,HN</p>
        <p>Email: Teamkhobau@gmail.com</p>
        <p>Điện thoại: 0686.868.686</p>
      </div>

      <!-- Phần danh mục sản phẩm -->
      <div class="product-categories">
        <h3>Danh mục sản phẩm</h3>
        <ul>
          <li><a href="#">Sản phẩm cho chó</a></li>
          <li><a href="#">Sản phẩm cho mèo</a></li>
          <li><a href="#">Thuốc và dinh dưỡng</a></li>
          <li><a href="#">Vệ sinh và chăm sóc</a></li>
        </ul>
      </div>

      <!-- liên hệ với chúng tôi  -->
      <div class="footer-content">
        <h3>Liên hệ với chúng tôi</h3>
        <ul class="socials">
          <li><img src="/src/assets/img/fb.png" /></li>
          <li><img src="/src/assets/img/tiktok.png" /></li>
          <li><img src="/src/assets/img/calll.png" /></li>
        </ul>
      </div>
      <div class="footer-section map">
        <h3>Vị Trí Của Chúng Tôi</h3>
        <div class="footer-section map">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.7674813324525!2d105.75861447471476!3d21.04198768732518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313454c1ab4fd2b5%3A0xaf2a3232acbdfeb!2zOCDEkC4gQ-G6p3UgRGnhu4VuLCBD4bqndSBEaeG7hW4sIFThu6sgTGnDqm0sIEjDoCBO4buZaSwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1726983127437!5m2!1svi!2s" 
          width="250" height="150" style="border:0;" allowfullscreen="true" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    </div>
  </footer>
</template>
<style lang="scss" scoped>
footer {
  width: 100%;
  height: auto;
  background-color: #292828; /* Màu nền */
  padding: 20px;
}

.footer-container {
  display: flex;
  justify-content: space-between; /* Chia đều các phần */
  flex-wrap: wrap; /* Để phần tử xuống dòng nếu không đủ không gian */
}

.footer-container {
  div {
    flex: 1; /* Đảm bảo mỗi phần tử chiếm đều không gian */
    margin-right: 20px;
  }
}

h3 {
  font-size: 1.2em;
  margin-bottom: 10px;
  color: #ffff;
}

p,
ul {
  margin: 5px 0;
  color: #a6a1a1;
}

ul {
  list-style-type: none; /* Loại bỏ dấu chấm danh sách */
  padding: 0;
}

ul li {
  margin-bottom: 8px;
}

ul li a {
  text-decoration: none;
  color: #a6a1a1; /* Màu chữ của liên kết */
}

ul li a:hover {
  text-decoration: underline;
}

/* Phần liên hệ với chúng tôi */
.socials {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 10px 0 0 0;
}

.socials li {
  margin-right: 10px;
}

.socials img {
  width: 32px; /* Kích thước biểu tượng */
  height: 32px;
}

/* Responsive cho màn hình nhỏ hơn */
@media (max-width: 768px) {
  .footer-container {
    flex-direction: column; /* Xếp chồng các phần tử theo chiều dọc */
  }

  .footer-container div {
    margin-bottom: 5px; /* Tạo khoảng cách giữa các phần */
  }
  .contact-info,
  .map {
    text-align: left;
    flex: 1;
    padding: 0 20px;
  }
}
</style>