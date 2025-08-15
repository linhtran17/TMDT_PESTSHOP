<template>
    <div class="profile-container">
      <div class="container mt-4">
        <div class="row">
          <!-- Sidebar -->
          <div class="col-md-3">
            <div class="sidebar p-3">
              <div class="text-center mb-4">
                <img
                  :src="user?.savedAvatar || state.avatarPreview || state.defaultAvatar"
                  alt="User Avatar"
                  class="rounded-circle img-thumbnail"
                />
              </div>
              <div class="user-option">
                <div class="option" @click="goToProfile">
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
                <div
                  class="option"
                  @click="goToNotifications"
                  style="background-color: black; border: 5px solid red; color: beige;"
                >
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
  
          <!-- Notification Content -->
          <div class="col-md-9">
            <div class="notification-list">
              <div v-for="(item, index) in notifications" :key="index" class="notification-item">
                <div class="row align-items-center">
                  <div class="col-2">
                    <img :src="item.image" alt="Notification Image" class="notification-img" />
                  </div>
                  <div class="col-8">
                    <h5 class="notification-title">{{ item.title }}</h5>
                    <p class="notification-time">{{ item.time }}</p>
                    <p class="notification-content">{{ item.content }}</p>
                  </div>
                  <div class="col-2 text-end">
                    <a href="http://localhost:3000/"><button class="btn btn-outline-primary btn-sm">Xem Chi Tiết</button></a>
                  </div>
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
    defaultAvatar: "https://media.assettype.com/analyticsinsight%2F2024-11-28%2Frzfeyqc9%2FViral-Meme-Chill-Guy-Inspires-New-Cryptocurrency-Surge.jpg?w=768&auto=format%2Ccompress&fit=max",
  });
  
  const user = storeAuth.user || {};
  
  const notifications = reactive([
    {
      title: "Petstore Mall vừa ra mắt với nhiều sản phẩm thú cưng siêu xịn",
      time: "13:04 04-12-2024",
      content: "Petstore tặng quà bự, thỏa thích mua sắm  🛒 Các mã sẽ hết hạn vào 14-12-2024! Xài ngay nha!",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD-dg6ev0NO44dotGzDNamjFcuHRZGcl7gyQ&s",
    },
    {
      title: "Kính mắt mèo màu cực xịn trong giỏ đợi bạn",
      time: "19:02 03-12-2024",
      content: "Nhanh tay chốt đơn ngay! Nếu còn phân vân, hãy tham khảo các sản phẩm tương tự TẠI ĐÂY! 🕶️",
      image: "https://product.hstatic.net/200000392467/product/ae884008efbeee1f35b820578a165b10_a87fff5efcea4128a7c8fd0a83d29c8f_master.jpg",
    },
    {
      title: "Giáng sinh tới rồi , hãy lên đồ cho các chú cún của mình nào!",
      time: "13:00 03-12-2024",
      content: "Ngại gì mà không vào xem thử những sản phẩm đón giáng sinh !",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-h12mjhnLuetbNJwk9ni4umlLeQiZeQautg&s",
    },
    {
      title: "Những tin tức mới đã được cập nhật tại Petstore!",
      time: "23:00 02-12-2024",
      content: "Mùa đông tới rồi , bạn đã biết cách chăm sóc thú cưng của mình chưa! 🛍️",
      image: "https://thuythithi.com/wp-content/uploads/2022/01/kinh-nghiem-cham-soc-thu-cung-trong-mua-dong-2.jpg",
    },
  ]);
  
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
    background-color: #f7f9fc;
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
  
  .notification-list {
    background-color: #ebc0ce;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .notification-item {
    border-bottom: 1px solid #ddd;
    padding: 15px 0;
  }
  
  .notification-img {
    width: 100%;
    border-radius: 5px;
  }
  
  .notification-title {
    font-weight: bold;
    color: #333;
  }
  
  .notification-time {
    font-size: 0.9rem;
    color: #999;
  }
  
  .notification-content {
    font-size: 0.95rem;
    color: #666;
  }
  
  .btn-outline-primary {
    border-color: #ff006a;
    color: #ff0040;
  }
  
  .btn-outline-primary:hover {
    background-color: #ff0000;
    color: white;
  }
  </style>
  