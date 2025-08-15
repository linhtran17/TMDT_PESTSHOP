<template>
    <div class="profile-container">
      <div class="container mt-4">
        <div class="row">
          <!-- Sidebar -->
          <div class="col-md-3">
            <div class="sidebar p-3">
              <div class="text-center mb-4">
                <img
                  :src="
                    user?.savedAvatar ||
                    state.avatarPreview ||
                    state.defaultAvatar
                  "
                  alt="User Avatar"
                  class="rounded-circle img-thumbnail"
                />
              </div>
              <div class="user-option">
                <div
                  class="option"
                  @click="goToProfile"
                  style="background-color: black; color: beige;border: 5px solid red;"
                >
                  <i class="fas fa-user me-2"></i> Hồ Sơ
                </div>
                <div class="option" @click="goToPurchases">
                  <i class="fas fa-university me-2"></i> Đơn hàng của bạn
                </div>
                <div class="option" @click="goToAddress">
                  <i class="fas fa-map-marker-alt me-2"></i> Địa Chỉ
                </div>
                <div class="option" @click="goToPasswordChange">
                  <i class="fas fa-key me-2"></i> Đổi Mật Khẩu
                </div>
                <div class="option" @click="goToNotifications">
                  <i class="fas fa-bell me-2"></i> Thông Báo
                </div>
                <div class="option" @click="goToVouchers">
                  <i class="fas fa-wallet me-2"></i> Kho Voucher
                </div>
                <div class="option" @click="goToReviews">
                  <i class="fas fa-lock me-2"></i> Đánh giá
                </div>
              </div>
            </div>
          </div>
          <!-- Profile Content -->
          <div class="col-md-9">
            <div class="card">
              <div class="card-header custom-card-header">
                <h5>Hồ Sơ Của Tôi</h5>
                <p>Quản lý thông tin hồ sơ tài khoản Petstore của bạn</p>
              </div>
              <div class="card-body">
                <form @submit.prevent="saveProfile">
                  <div class="mb-3">
                    <label for="name" class="form-label">Họ và tên</label>
                    <input
                      type="text"
                      class="form-control"
                      id="name"
                      placeholder="Nhập tên nhận hàng"
                      v-model="state.fullname"
                    />
                  </div>
                  <div class="mt-3">
                    <label for="phone" class="form-label">Số điện thoại:</label>
                    <input
                      type="phone"
                      class="form-control"
                      id="phone"
                      placeholder="Nhập số điện thoại nhận hàng"
                      v-model="state.phone"
                    />
                  </div>
                  <div class="mt-3">
                    <label for="email" class="form-label">Email:</label>
                    <input
                      type="email"
                      class="form-control"
                      id="email"
                      placeholder="Nhập email nhận hàng"
                      v-model="state.email"
                    />
                  </div>
                  <div class="mt-3">
                    <label for="address" class="form-label">Địa chỉ:</label>
                    <input
                      type="address"
                      class="form-control"
                      id="address"
                      placeholder="Nhập địa chỉ nhận hàng"
                      v-model="state.deliveryAddress"
                    />
                  </div>
                  <div class="mt-3">
                    <label for="gender" class="form-label">Giới tính:</label>
                    <div>
                      <input
                        type="radio"
                        id="male"
                        value="Nam"
                        v-model="state.gender"
                      />
                      <label for="male">Nam</label>
                      <br />
                      <input
                        type="radio"
                        id="female"
                        value="Nữ"
                        v-model="state.gender"
                      />
                      <label for="female">Nữ</label>
                      <br />
                      <input
                        type="radio"
                        id="other"
                        value="Khác"
                        v-model="state.gender"
                      />
                      <label for="other">Khác</label>
                    </div>
                  </div>
                  <div class="mt-3">
                    <label for="dob" class="form-label">Ngày sinh:</label>
                    <input
                      type="date"
                      class="form-control me-2"
                      id="dob"
                      placeholder="Nhập ngày sinh"
                      v-model="state.dob"
                    />
                  </div>
                  <div class="mt-3">
                    <label for="createdAt" class="form-label"
                      >Ngày tạo tài khoản:</label
                    >
                    <input
                      type="text"
                      class="form-control me-2"
                      id="createdAt"
                      :value="state.created_at"
                      readonly
                    />
                  </div>
                  <div class="mt-3">
                    <label for="avatar" class="form-label">Chọn Ảnh</label>
                    <input
                      type="file"
                      class="form-control"
                      id="avatar"
                      accept="image/png, image/jpeg"
                      @change="onFileChange"
                    />
                    <small class="text-muted"
                      >Dung lượng file tối đa 1 MB. Định dạng: JPEG, PNG...</small
                    >
                  </div>
                  <button type="submit" class="btn btn-danger">Lưu</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive, onMounted } from "vue";
  import { useAuth } from "@/stores/auth";
  import { useRouter } from "vue-router";
  import { notify } from "@kyvg/vue3-notification";
  
  const router = useRouter();
  const storeAuth = useAuth();
  
  const state = reactive({
    fullname: "",
    deliveryAddress: "",
    phone: "",
    email: "",
    gender: "",
    dob: "",
    avatarPreview: null,
    defaultAvatar:
      "https://media.assettype.com/analyticsinsight%2F2024-11-28%2Frzfeyqc9%2FViral-Meme-Chill-Guy-Inspires-New-Cryptocurrency-Surge.jpg?w=768&auto=format%2Ccompress&fit=max",
    created_at: "", // Thêm trường để lưu ngày tạo tài khoản
  });
  
  const user = storeAuth.user || {};
  
  const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.size <= 1048576) {
      const reader = new FileReader();
      reader.onload = (e) => {
        state.avatarPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      alert("Vui lòng chọn file có dung lượng tối đa 1MB.");
    }
  };
  
  const saveProfile = () => {
    if (state.avatarPreview) {
      user.savedAvatar = state.avatarPreview;
      state.avatarPreview = null;
    }
  
    // Hiển thị thông báo
    notify({
      type: "success",
      title: "Thành công",
      text: "Hồ sơ của bạn đã được lưu thành công!",
    });
  };
  
  onMounted(() => {
    state.fullname = user.username || "";
    state.deliveryAddress = user.address || "";
    state.phone = user.phone || "";
    state.email = user.email || "";
    state.gender = user.gender || "";
    state.dob = user.dob || "";
    state.created_at = user.created_at || "19/11/2024"; // Lấy ngày tạo tài khoản
  });
  
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
  .notification.success {
    background-color: #4caf50;
    color: white;
    font-weight: bold;
    border-radius: 5px;
  }
  
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
  
  .custom-card-header {
    background: linear-gradient(to right, #ff7e5f, #feb47b); /* Gradient nền */
    color: #ffffff; /* Màu chữ trắng */
    border-bottom: none;
    padding: 1rem;
  }
  
  .card-body {
    padding: 20px;
    
  }
  
  .card {
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Đổ bóng cho card */
  }
  
  .form-label {
    font-weight: 600; /* In đậm tiêu đề */
  }
  
  .form-control {
    border-radius: 5px; /* Bo góc input */
    padding: 10px; /* Khoảng cách padding */
    box-shadow: 0 8px 8px rgba(0, 0, 0, 0.1);
  }
  
  .btn-primary {
    background-color: #ff008c;
    border-color: #007bff;
  }
  
  .btn-primary:hover {
    background-color: #0056b3;
    border-color: #004085;
  }
  
  .text-primary {
    color: #007bff;
  }
  
  .text-primary:hover {
    color: #0056b3;
  }
  
  .rounded-circle {
    width: 200px;
    height: 200px;
  }
  
  .mt-2 {
    margin-top: 0.5rem;
  }
  
  .mb-3 {
    margin-bottom: 1rem;
  }
  
  .me-2 {
    margin-right: 0.5rem;
  }
  
  .dob-inputs {
    display: flex;
    gap: 10px;
  }
  
  .btn-danger {
    background-color: #f59696;
    border-color: #ff3c3c;
  }
  
  .btn-danger:hover {
    background-color: rgb(243, 4, 36);
    transform: scale(1.2);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  }
  </style>