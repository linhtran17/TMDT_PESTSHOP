<template>
  <section class="container_QC">
    <div class="main-table">
      <h2>Tại Sao Nên Chọn PET SHOP?</h2>
      <div class="sub-tables-container">
        <div class="sub-table">
          <img src="@/assets/icons/phonCall.png" />
          <h3>Chăm sóc khách hàng</h3>
          <p>Hỗ trợ khách hàng 24/7</p>
        </div>
        <div class="sub-table">
          <img src="@/assets/icons/money.png" />
          <h3>Giá cả hợp lý</h3>
          <p>Phù hợp với mọi ngân sách</p>
        </div>
        <div class="sub-table">
          <img src="@/assets/icons/ship.png" />
          <h3>Miễn phí giao hàng</h3>
          <p>Khi đơn hàng đạt >300k</p>
        </div>
        <div class="sub-table">
          <img src="@/assets/icons/v.png" />
          <h3>An toàn tuyệt đối</h3>
          <p>Sản phẩm được chọn lọc kĩ càng</p>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped>
.container_QC {
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  margin: 0;
}

.main-table {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: auto; /* Giới hạn chiều rộng của phần tử chính */
  width: 100%;
}

h2 {
  font-size: 28px;
  color: #333;
  margin-bottom: 20px;
}

.sub-tables-container {
  display: flex; /* Đặt các bảng con nằm ngang */
  justify-content: space-between; /* Tạo khoảng cách đều giữa các bảng con */
  width: 100%; /* Chiếm toàn bộ chiều rộng của phần tử cha */
}

.sub-table {
  background-color: #e0e0e0;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  margin: 10px;
  text-align: center;
  transition: transform 0.2s;
  flex: 1; /* Đảm bảo các bảng con chiếm kích thước bằng nhau */
  max-width: 220px; /* Đặt chiều rộng tối đa cho mỗi bảng con */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.sub-table:hover {
  transform: scale(1.05); /* Phóng to một chút khi hover */
}

.sub-table h3 {
  font-size: 20px;
  margin-bottom: 10px;
}

.sub-table p {
  font-size: 16px;
  margin: 0;
}
.sub-table img {
  margin-bottom: 15px; /* Khoảng cách giữa ảnh và tiêu đề */
  width: 100px; /* Đặt chiều rộng cố định cho ảnh */
  height: 100px; /* Đặt chiều cao cố định cho ảnh */
  object-fit: cover; /* Giúp ảnh vừa khít trong khung hình mà không bị méo */
  margin-bottom: 15px; /* Khoảng cách giữa ảnh và tiêu đề */
}
</style>