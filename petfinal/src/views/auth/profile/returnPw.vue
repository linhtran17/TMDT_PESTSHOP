<template>
    <div class="forgot-password">
      <div class="forgot-password-box">
        <div class="header">
          <h2>Quên mật khẩu <br> <span class="icon">PetStore</span></h2>
        </div>
        <div class="content">
          <div v-if="!verificationSent">
            <form @submit.prevent="sendVerificationCode">
              <div class="form-group">
                <label for="email">Email:</label>
                <p>( <span style="color: red;"> *</span> )Nếu bạn quên mật khẩu tài khoản, hãy nhập email ở đây nhé </p>
                <input
                  type="email"
                  id="email"
                  v-model="email"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <button type="submit" class="btn-submit" style="text-decoration: none;">Gửi mã xác nhận</button>
            </form>
          </div>
          <div v-else>
            <form @submit.prevent="verifyCode">
              <div class="form-group">
                <label for="verificationCode">Mã xác nhận:</label>
                <input
                  type="text"
                  id="verificationCode"
                  v-model="verificationCode"
                  placeholder="Enter verification code"
                  required
                />
              </div>
              <div class="form-group">
                <label for="newPassword">Mật khẩu mới:</label>
                <input
                  type="password"
                  id="newPassword"
                  v-model="newPassword"
                  placeholder="Enter new password"
                  required
                />
              </div>
              <button type="submit" class="btn-submit">Xác nhận</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>  
<script setup>
import { ref } from "vue";
import { notify } from "@kyvg/vue3-notification";

const email = ref("");
const verificationCode = ref("");
const newPassword = ref("");
const verificationSent = ref(false);
const generatedCode = ref("");

const sendVerificationCode = () => {
  // Generate a random 8-digit code
  generatedCode.value = Math.random().toString().slice(2, 10);

  // Send the code to the user's email (here you would integrate with an email service)
  console.log(`Sending code ${generatedCode.value} to ${email.value}`);

  notify({ type: "success", text: "Mã xác nhận đã được gửi tới email của bạn!" });
  verificationSent.value = true;
};

const verifyCode = () => {
  if (verificationCode.value === generatedCode.value) {
    // Update the password (here you would integrate with your backend)
    console.log(`Updating password for ${email.value} to ${newPassword.value}`);

    notify({ type: "success", text: "Mật khẩu của bạn đã được cập nhật thành công!" });
    // Reset the form
    email.value = "";
    verificationCode.value = "";
    newPassword.value = "";
    verificationSent.value = false;
  } else {
    notify({ type: "error", text: "Mã xác nhận không chính xác. Vui lòng thử lại." });
  }
};
</script>
<style scoped>
.forgot-password {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url("@/assets/img/background-login-sign.png");
  font-family: Arial, sans-serif;
}

.forgot-password-box {
  width: 700px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  padding: 20px;
  text-align: center;
}

.header h2 {
  font-size: 24px;
  color: #f7659d;
  font-weight: bold;
  margin-bottom: 20px;
}

.icon {
  color: #f350a1;
  font-family: "Lobster", cursive;
  font-size: 60px;
}

.content form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: #f7659d;
}

.btn-submit {
  padding: 10px;
  background-color: #f7659d;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-submit:hover {
  background-color: #d54e8c;
}

.btn-submit:active {
  background-color: #b74075;
}

/* CSS để bỏ dấu gạch chân dưới khi hover */
a, a:link, a:visited, a:hover, a:active { text-decoration: none; }
</style>