<template>
    <div class="profile-container">
      <div class="container mt-4">
        <div class="row">
          <!-- Sidebar -->
          <div class="col-md-3">
            <div class="sidebar p-3">
              <div class="text-center mb-4">
                <img :src="user?.savedAvatar || state.avatarPreview || state.defaultAvatar" alt="User Avatar" class="rounded-circle img-thumbnail" />
              </div>
              <div class="user-option">
                <div class="option" @click="goToProfile"><i class="fas fa-user me-2"></i> Hồ Sơ</div>
                <div class="option" @click="goToPurchases"><i class="fas fa-university me-2"></i> Đơn hàng của bạn</div>
                <div class="option" @click="goToAddress" style="background-color: black; color: beige; border: 5px solid red;">
                  <i class="fas fa-map-marker-alt me-2"></i> Địa Chỉ
                </div>
                <div class="option" @click="goToPasswordChange"><i class="fas fa-key me-2"></i> Đổi Mật Khẩu</div>
                <div class="option" @click="goToNotifications"><i class="fas fa-bell me-2"></i> Thông Báo</div>
                <div class="option" @click="goToVouchers"><i class="fas fa-wallet me-2"></i> Kho Voucher</div>
                <div class="option" @click="goToReviews"><i class="fas fa-lock me-2"></i> Đánh giá</div>
              </div>
            </div>
          </div>
  
          <!-- Main Content -->
          <div class="col-md-9">
            <div class="content-container p-4">
              <div class="d-flex justify-content-between align-items-center mb-3" >
                <h2>Địa chỉ của tôi</h2>
                <button class="btn btn-primary" @click="toggleAddForm">+ Thêm địa chỉ mới</button>
              </div>
  
              <!-- Form thêm địa chỉ mới -->
              <div v-if="state.showAddForm" class="add-address-form">
                <div class="form-group">
                  <label for="name">Họ và tên</label>
                  <input type="text" v-model="newAddress.name" class="form-control" id="name" required>
                </div>
                <div class="form-group">
                  <label for="phone">Số điện thoại</label>
                  <input type="text" v-model="newAddress.phone" class="form-control" id="phone" required>
                </div>
                <div class="form-group">
                  <label for="street">Địa chỉ</label>
                  <input type="text" v-model="newAddress.street" class="form-control" id="street" required>
                </div>
                <div class="form-group">
                  <label for="district">Quận/Huyện</label>
                  <input type="text" v-model="newAddress.district" class="form-control" id="district" required>
                </div>
                <div class="form-group">
                  <label for="city">Tỉnh/Thành phố</label>
                  <input type="text" v-model="newAddress.city" class="form-control" id="city" required>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" v-model="newAddress.default" id="default">
                  <label class="form-check-label" for="default">
                    Đặt làm địa chỉ mặc định
                  </label>
                </div>
                <button class="btn btn-success mt-3" @click="addAddress">Hoàn thành</button>
                <button class="btn btn-secondary mt-3" @click="toggleAddForm">Hủy</button>
              </div>
  
              <!-- Danh sách địa chỉ -->
              <div class="address-list">
                <div class="address-item" v-for="address in state.addresses" :key="address.id">
                  <div class="d-flex justify-content-between">
                    <div>
                      <strong>{{ address.name }}</strong>
                      <p>{{ address.street }}, {{ address.district }}, {{ address.city }}</p>
                      <span v-if="address.default" class="badge bg-success">Mặc định</span>
                    </div>
                    <div class="address-actions">
                      
                      <button class="btn btn-outline-danger btn-sm" @click="deleteAddress(address.id)">Xóa</button>
                    </div>
                  </div>
                </div>
                <div v-if="state.addresses.length === 0" class="text-center py-3 fw-bold">Không có địa chỉ nào.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script setup>
  import { reactive } from "vue";
  import { useAuth } from "@/stores/auth";
  import { useRouter } from "vue-router";
  import { notify } from "@kyvg/vue3-notification";
  
  const router = useRouter();
  const storeAuth = useAuth();
  
  const state = reactive({
    avatarPreview: null,
    defaultAvatar: "https://media.assettype.com/analyticsinsight%2F2024-11-28%2Frzfeyqc9%2FViral-Meme-Chill-Guy-Inspires-New-Cryptocurrency-Surge.jpg?w=768&auto=format%2Ccompress&fit=max",
    addresses: [
      { id: 1, name: "Anh Minh ", phone: "0123456789", street: "89 Phúc Diễn", district: "Bắc Từ Liêm", city: "Hà Nội", default: true },
      { id: 2, name: "Anh Minh1 ", phone: "0123456789", street: "109 Phú Diễn", district: "Bắc Từ Liêm", city: "Hà Nội", default: false },
      { id: 3, name: "Nguyễn Thị Thùy Linh ", phone: "0987654321", street: "456 Lê Lợi", district: "Hà Đông", city: "Hà Nội", default: false },
      { id: 4, name: "Trần Thị B", phone: "0987654321", street: "456 Lê Lợi", district: "Hà Đông", city: "Hà Nội", default: false },
      { id: 4, name: "Trần Thị Linh", phone: "0987654321", street: "Thanh Trung", district: "Hà Đông", city: "Hà Nội", default: false },
    ],
    showAddForm: false
  });
  
  const user = storeAuth.user || {};
  const newAddress = reactive({
    name: "",
    phone: "",
    street: "",
    district: "",
    city: "",
    default: false
  });
  
  const toggleAddForm = () => {
    state.showAddForm = !state.showAddForm;
  };
  
  const addAddress = () => {
    state.addresses.push({ id: Date.now(), ...newAddress });
    Object.assign(newAddress, { name: "", phone: "", street: "", district: "", city: "", default: false });
    state.showAddForm = false;
    notify({
      type: 'success',
      title: 'Thành công',
      text: 'Thêm địa chỉ mới thành công!',
    });
  };
  
  // const editAddress = (id) => {
  //   notify({
  //     type: 'success',
  //     title: 'Thành công',
  //     text: 'Cập nhật địa chỉ thành công!',
  //   });
  // };
  
  const deleteAddress = (id) => {
    state.addresses = state.addresses.filter(address => address.id !== id);
    notify({
      type: 'success',
      title: 'Thành công',
      text: 'Xóa địa chỉ thành công!',
    });
  };
  
  // Điều hướng các chức năng sidebar
  const goToProfile = () => router.push({ name: "profile" });
  const goToPurchases = () => router.push({ name: "purchases" });
  const goToAddress = () => router.push({ name: "address" });
  const goToPasswordChange = () => router.push({ name: "changePass" });
  const goToNotifications = () => router.push({ name: "notification" });
  const goToVouchers = () => router.push({ name: "vouchers" });
  const goToReviews = () => router.push({ name: "Danhgia" });
  </script>
  
  <style scoped lang="scss">
  .profile-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #f7f9fc; /* Màu nền tổng thể */
  }
  
  .sidebar {
    background-color: #f5ed84;
    border-radius: 10px;
    padding: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Đổ bóng cho sidebar */
  }
  
  .user-option {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .option {
    border: none;
    padding: 1rem;
    margin: 0 8px;
    cursor: pointer;
    transition: background-color 0.3s;
    border-radius: 5px;
    background-color: #ffffff;
  }
  
  .option:hover {
    background-color: #000000;
    color: #ffffff;
  }
  
  .rounded-circle {
    width: 200px !important; 
    height: 200px !important;
  }
  .content-container {
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-top: 20px;
  }
  
  .address-list {
    margin-top: 20px;
  }
  
  .address-item {
    padding: 20px 0;
    border-bottom: 1px solid #ddd;
  }
  
  .address-item:last-child {
    border-bottom: none;
  }
  
  .badge {
    font-size: 0.9rem;
  }
  
  .btn {
    margin-left: 10px;
  }
  
  .d-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
   
  }
  
  .address-actions {
    display: flex;
    gap: 10px;
  }
  
  .btn-primary {
    background-color: #007bff;
    border-color: #007bff;
  }
  
  .btn-primary:hover {
    background-color: #0056b3;
    border-color: #004085;
  }
  
  .btn-outline-secondary {
    border-color: #6c757d;
  }
  
  .btn-outline-secondary:hover {
    background-color: #6c757d;
    color: #ffffff;
    border-color: #5a6268;
  }
  
  .btn-outline-danger {
    border-color: #dc3545;
  }
  
  .btn-outline-danger:hover {
    background-color: #dc3545;
    color: #ffffff;
    border-color: #c82333;
  }
  
  .rounded-circle {
    width: 150px;
    height: 150px;
    margin-bottom: 20px;
  }
  
  /* Form thêm địa chỉ mới */
  .add-address-form {
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .form-group label {
    font-weight: bold;
  }
  
  .form-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .form-check {
    margin-top: 1rem;
  }
  
  .form-check-input {
    margin-right: 10px;
  }
  
  .form-check-label {
    display: inline-block;
  }
  </style>