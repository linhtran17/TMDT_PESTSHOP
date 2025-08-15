<template>
    <div id="chat-box">
      <!-- Icon bật/tắt chat -->
      <div id="chat-toggle" @click="toggleChat" :class="{ hidden: showChat }">
        <img src="https://cdn1.iconfinder.com/data/icons/social-17/48/chat2-64.png" alt="Chat Icon" />
      </div>
  
      <!-- Cửa sổ chat -->
      <div id="chat-window" v-if="showChat">
        <header>
          <div class="header-title">Petstore 🐾🐶🐱</div>
          <div @click="toggleChat" class="close-icon">×</div>
        </header>
        <div class="chat-body">
          <!-- Tin nhắn từ admin -->
          <div class="message admin">
            <img src="https://cdn3.iconfinder.com/data/icons/users-avatars-2/128/superman-64.png" alt="Admin Avatar" class="avatar" />
            <div class="message-content">Chào mừng bạn đã tới với<strong> <i> Petstore - Nơi chăm sóc thú cưng của bạn </i>💖</strong>. Bạn muốn mình giúp gì cho bạn?</div>
          </div>
  
          <!-- Tin nhắn từ người dùng -->
          <div v-for="(message, index) in userMessages" :key="index" class="message user">
            <div class="message-content">{{ message }}</div>
          </div>
  
          <!-- Phản hồi từ admin -->
          <div class="message admin" v-if="adminResponse">
            <img src="https://cdn3.iconfinder.com/data/icons/users-avatars-2/128/superman-64.png" alt="Admin Avatar" class="avatar" />
            <div class="message-content"  v-html="adminResponse"></div>
          </div>
        </div>
        <div class="chat-footer">
          <input type="text" v-model="userInput" placeholder="Nhập tin nhắn của bạn..."  @keyup.enter="sendMessage" />
          <button @click="sendMessage">Gửi</button>
        </div>
      </div>
    </div>
  </template>
  <script>
  export default {
    name: "ChatBox",
    data() {
      return {
        showChat: false, // Trạng thái hiển thị của chat box
        userInput: "", // Nội dung tin nhắn người dùng nhập
        userMessages: [], // Danh sách tin nhắn của người dùng
        adminResponse: "", // Tin nhắn phản hồi của admin
      };
    },
    methods: {
      // Bật/tắt cửa sổ chat
      toggleChat() {
        this.showChat = !this.showChat;
      },
      // Gửi tin nhắn của người dùng
      sendMessage() {
        if (this.userInput.trim()) {
          this.userMessages.push(this.userInput); // Thêm tin nhắn vào danh sách
          this.userInput = ""; // Xóa nội dung input
          setTimeout(() => {
            this.adminResponse = 'Bạn hãy nhấn <a href="http://localhost:3000/contact" style="color: palevioletred;">TẠI ĐÂY</a>, sau đó điền thông tin nhu cầu của bạn để được admin giải đáp nhanh nhất nhé !!🤗';
          }, 2500); // Giả lập phản hồi sau 1 giây
        }
      },
    },
  };
  </script>
  <style scoped>
  /* Vị trí chính của chat box */
  #chat-box {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
  }
  
  /* Nút bật/tắt chat box */
  #chat-toggle {
    width: 80px; /* Tăng kích thước của nút */
    height: 80px; /* Tăng kích thước của nút */
    background-color: #f56a6a;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.541);
  }
  
  #chat-toggle img {
    width: 40px; /* Tăng kích thước của icon */
    height: 40px; /* Tăng kích thước của icon */
  }
  
  #chat-toggle.hidden {
    display: none; /* Ẩn nút khi chat được mở */
  }
  
  /* Cửa sổ chat */
  #chat-window {
    width: 400px; /* Tăng kích thước của cửa sổ chat */
    height: 500px; /* Tăng kích thước của cửa sổ chat */
    background: #e9caca;
    border-radius: 10px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  header {
    background: #f56a6a;
    color: #fff;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .close-icon {
    cursor: pointer;
    font-size: 20px;
  }
  
  .chat-body {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    display: flex;
    flex-direction: column;
  }
  
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }
  
  .message {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    max-width: 70%;
  }
  
  .message-content {
    padding: 10px;
    border-radius: 10px;
  }
  
  .message.admin .message-content {
    background: #f1f1f1;
  }
  
  .message.user {
    align-self: flex-end;
  }
  
  .message.user .message-content {
    background: #56b7e7;
  }
  
  .chat-footer {
    padding: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .chat-footer input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .chat-footer button {
    background: #f56a6a;
    color: #fff;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
  }
  </style>
  