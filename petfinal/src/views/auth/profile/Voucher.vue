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
                <div class="option" @click="goToAddress" >
                  <i class="fas fa-map-marker-alt me-2"></i> Địa Chỉ
                </div>
                <div class="option" @click="goToPasswordChange"><i class="fas fa-key me-2"></i> Đổi Mật Khẩu</div>
                <div class="option" @click="goToNotifications"><i class="fas fa-bell me-2"></i> Thông Báo</div>
                <div class="option" style="background-color: black; color: beige; border: 5px solid red;" @click="goToVouchers"><i class="fas fa-wallet me-2" ></i> Kho Voucher</div>
                <div class="option" @click="goToReviews"><i class="fas fa-lock me-2"></i> Đánh giá</div>
              </div>
            </div>
          </div>
  
          <!-- Voucher Container -->
          <div class="col-md-9">
            <div class="voucher-container">
              <div v-for="(voucher, index) in vouchers" :key="index" class="voucher-item">
                <div class="voucher-header">
                  <!-- <span class="badge badge-new">Mới</span> -->
                  <img :src="voucher.logo" alt="Voucher Logo" class="voucher-logo" />
                  <p class="voucher-brand">{{ voucher.brand }}</p>
                </div>
                <div class="voucher-body">
                  <p class="voucher-title">{{ voucher.title }}</p>
                  <p class="voucher-condition">{{ voucher.condition }}</p>
                </div>
                <div class="voucher-footer">
                  <span class="voucher-expiry">Có hiệu lực từ: {{ voucher.validDate }}</span>
                 <a href="http://localhost:3000/dogs" ><button class="btn btn-primary btn-sm">Dùng ngay</button></a>
                </div>
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
  
  const router = useRouter();
  const storeAuth = useAuth();
  
  const state = reactive({
    avatarPreview: null,
    defaultAvatar: "https://media.assettype.com/analyticsinsight%2F2024-11-28%2Frzfeyqc9%2FViral-Meme-Chill-Guy-Inspires-New-Cryptocurrency-Surge.jpg?w=768&auto=format%2Ccompress&fit=max"
  });
  
  const user = storeAuth.user || {};
  
  // Điều hướng các chức năng sidebar
  const goToProfile = () => router.push({ name: "profile" });
  const goToPurchases = () => router.push({ name: "purchases" });
  const goToAddress = () => router.push({ name: "address" });
  const goToPasswordChange = () => router.push({ name: "changePass" });
  const goToNotifications = () => router.push({ name: "notification" });
  const goToVouchers = () => router.push({ name: "vouchers" });
  const goToReviews = () => router.push({ name: "Danhgia" });
  
  const vouchers = reactive([
    {
      logo: "https://thegioituigiay.com/uploads/hinh-thuc-thanh-toan.png",
      brand: "Tất cả hình thức thanh toán",
      title: "Giảm tới đa 25k",
      condition: "Đơn Tối Thiểu 80k",
      validDate: "Có hiệu lực sau: 2 ngày",
    },
    {
      logo: "https://bizweb.dktcdn.net/100/229/172/articles/bai-21-5-19-tang-voucher-20-percentage-dich-vu.jpg?v=1558363364743",
      brand: "Khách hàng thân thiết",
      title: "Giảm tới đa 50k",
      condition: "Đơn Tối Thiểu 150k",
      validDate: "10.12.2024",
    },
    {
      logo: "https://png.pngtree.com/png-vector/20220514/ourmid/pngtree-voucher-discount-vector-png-image_4609862.png",
      brand: "Giảm giá chăm sóc thú cưng",
      title: "Giảm tới đa 80k",
      condition: "Đơn Tối Thiểu 400k",
      validDate: "10.12.2024",
    },
    {
      logo: "https://png.pngtree.com/png-vector/20220514/ourmid/pngtree-voucher-discount-vector-png-image_4609862.png",
      brand: "Khách hàng thân thiết",
      title: "Giảm tới đa 300k",
      condition: "Đơn Tối Thiểu 300k",
      validDate: "10.12.2024",
    },
  ]);
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
    width: 200px;
    height: 200px;
  }
  
  .voucher-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .voucher-item {
    flex: 1 1 calc(50% - 20px);
    display: flex;
    flex-direction: column;
    background-color: #f8f9fa;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 15px;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .voucher-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  
  .voucher-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .badge-new {
    background-color: #ff4757;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 0.8rem;
    margin-right: 10px;
  }
  
  .voucher-logo {
    width: 200px;
    height: 100px;
    margin-right: 10px;
    border-radius: 5px;
  }
  
  .voucher-brand {
    font-weight: bold;
    color: #333;
  }
  
  .voucher-body {
    padding: 10px 0;
  }
  
  .voucher-title {
    font-size: 1.1rem;
    font-weight: bold;
    color: #555;
  }
  
  .voucher-condition {
    font-size: 0.9rem;
    color: #999;
  }
  
  .voucher-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
  }
  
  .voucher-expiry {
    font-size: 0.8rem;
    color: #19ece2;
  }
  
  .btn-primary {
    background-color: #ff4757;
    border: none;
    transition: background-color 0.3s;
  }
  
  .btn-primary:hover {
    background-color: #e84118;
  }
  </style>
  