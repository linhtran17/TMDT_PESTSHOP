<template>
  <main class="contact">
    <div class="container">
      <div class="contact-form">
        <h2>Liên hệ với chúng tôi</h2>
        <h5>
          Bạn có câu hỏi, nhận xét hoặc ý tưởng tuyệt vời muốn chia sẻ? Gửi cho
          chúng tôi một ghi chú nhỏ bên dưới - chúng tôi muốn nghe ý kiến của
          bạn và sẽ luôn trả lời!
        </h5>
        <form @submit.prevent="onSubmit">
          <div class="form-group">
            <label for="name" style="font-size: 13px"
              ><strong>Họ và tên</strong>(<span style="color: rgb(225, 7, 7)"
                >*</span
              >)</label
            >
            <input
              type="text"
              id="name"
              v-model="form.name"
              placeholder="Tên của bạn"
              required
            />
          </div>
          <div class="form-group">
            <label for="email" style="font-size: 13px"
              ><strong>Email</strong>
            </label>
            <input
              type="email"
              id="email"
              v-model="form.email"
              placeholder="Email của bạn"
              required
            />
          </div>
          <div class="form-group">
            <label for="phone" style="font-size: 13px"
              ><strong>Số điện thoại</strong></label
            >
            <input
              type="text"
              id="phone"
              v-model="form.phone"
              placeholder="Số điện thoại của bạn"
              required
            />
          </div>
          <div class="form-group">
            <label for="content" style="font-size: 13px"
              ><strong>Nội dung</strong></label
            >
            <textarea
              id="content"
              v-model="form.content"
              placeholder="Nội dung"
              required
            ></textarea>
          </div>
          <div class="form-group">
            <button type="submit" :disabled="state.loading">Gửi đi</button>
          </div>
          <Loading v-if="state.loading" />
        </form>
      </div>
      <div class="contact-info">
        <h2>Thông tin liên hệ</h2>
        <h5>Vui lòng liên hệ với chúng tôi qua các thông tin cơ bản sau:</h5>
        <ul>
          <li><i class="fa fa-phone"></i>- Số điện thoại:0686868686</li>
          <li><i class="fa fa-envelope"></i>- Email: Teamkhobau@gmail.com</li>
          <li><i class="fa fa-globe"></i>- Website: www.Teamkhobau.com</li>
        </ul>
        <div class="social-icons">
          <div>
            <a href="#"
              ><img src="@/assets/img/fb.png" alt="" /><i
                class="fa fa-facebook"
              ></i
            ></a>
          </div>
          <a href="#"
            ><img src="@/assets/img/jg.png" alt="" /><i
              class="fa fa-instagramr"
            ></i
          ></a>
          <a href="#"
            ><img src="@/assets/img/gmail.png" alt="" /><i
              class="fa fa-gmail"
            ></i
          ></a>
          <a href="#"
            ><img src="@/assets/img/goi.png" alt="" /><i
              class="fa fa-contact"
            ></i
          ></a>
          <a href="#"
            ><img src="@/assets/img/yt.png" alt="" /><i
              class="fa fa-youtube"
            ></i
          ></a>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup>
import { reactive } from "vue";
import { useContactStore } from "@/stores/contactadmin";
import { notify } from "@kyvg/vue3-notification";
import Loading from "@/components/Loading.vue";

const contactStore = useContactStore();

const state = reactive({
  loading: false,
});

const form = reactive({
  name: "",
  email: "",
  phone: "",
  content: "",
});

async function onSubmit() {
  state.loading = true;
  try {
    await contactStore.addContact(form);
    notify({
      title: "Thông báo",
      text: "Liên hệ của bạn đã được gửi thành công!",
    });
    form.name = "";
    form.email = "";
    form.phone = "";
    form.content = "";
  } catch (error) {
    notify({
      type: "error",
      title: "Thông báo",
      text: "Gửi liên hệ thất bại, vui lòng thử lại.",
    });
  } finally {
    state.loading = false;
  }
}
</script>
<style scoped>
.contact {
  font-family: Arial, sans-serif;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 342px);
  background-color: #f4f4f4;
}

.container {
  display: flex;
  background: #fff;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.contact-form,
.contact-info {
  margin: 10px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.contact-form {
  flex: 1;
}

.contact-info {
  flex: 1;
  position: relative;
}

.contact-form h2,
.contact-info h2 {
  margin-top: 0;
}

.contact-form input,
.contact-form textarea {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.contact-form button {
  padding: 10px 20px;
  background: #e40ba3;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.contact-info ul {
  list-style: none;
  padding: 0;
}

.contact-info ul li {
  margin: 10px 0;
}

.contact-info ul li i {
  margin-right: 10px;
}

.social-icons {
  display: flex;
  margin-top: 40px;
  gap: 15px;
}

.social-icons a {
  text-decoration: none;
  color: #630cee;
  font-size: 24px;
}
</style>
