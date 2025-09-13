<template>
  <div class="modal-login">
    <!-- cần expose show()/hide() trong UpdateUser.vue -->
    <ModalUpdateUser ref="updateUserRef" />

    <div class="user-info">
      <template v-if="auth.isAuthenticated">
        <div class="username">{{ auth?.user?.username || 'anonymous' }}</div>
        <div class="user-option">
          <div
            v-if="auth.isAdmin"
            class="option"
            @click="() => router.push({ name: 'dashboard' })"
          >
            Trang Admin
          </div>
          <div class="option" @click="goToProfile">Tài khoản của bạn</div>
          <div class="option" @click="auth.logout()">Đăng xuất</div>
        </div>
      </template>

      <!-- Đổi b-button -> BButton, bỏ $bvModal -->
      <BButton
        v-else
        id="show-btn"
        class="btn btn-outline-light btn-login"
        @click="show"
      >
        Đăng nhập
      </BButton>
    </div>

    <!-- Đổi b-modal -> BModal, điều khiển bằng v-model -->
    <BModal v-model="open" id="bv-login" hide-footer hide-header size="lg">
      <div class="login-box">
        <div class="close" @click="hide">×</div>

        <div class="mb-3 h2">
          <div class="mb-3 d-flex justify-content-center">
            <div class="h2">
              <b><i>Đăng nhập <span class="icon">PetStore</span></i></b>
            </div>
          </div>
        </div>

        <div>
          <div class="mb-3">
            <label for="email" class="form-label">Email:</label>
            <input
              id="email"
              type="email"
              class="form-control"
              placeholder="Enter Email"
              v-model="userProps.email"
              @keyup.enter="onLogin"
            />
            <div v-if="errorEmail" class="error">{{ errorEmail }}</div>
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Password:</label>
            <input
              id="password"
              type="password"
              class="form-contarol"
              placeholder="Enter Password"
              v-model="userProps.password"
              @keyup.enter="onLogin"
            />
            <div v-if="errorPassword" class="error">{{ errorPassword }}</div>
          </div>

          <div class="w-100">
            <button
              class="btn btn-outline-light pet-btn-primary w-100"
              :disabled="isLoading"
              @click="onLogin"
            >
              {{ isLoading ? 'Đang xử lý...' : 'Đăng nhập' }}
            </button>

            <div class="w-100 d-flex justify-content-center align-items-center">
              <GoogleSignInButton
                class="mt-3"
                @success="handleLoginSuccess"
                @error="handleLoginError"
              />
              <div>
                <a href="#" class="forgot-password" @click.prevent="onForgotPassword">
                  <u><i>Quên mật khẩu ⍰⍰</i></u>
                </a>
              </div>
            </div>
          </div>

          <div v-if="error && error.length" class="error">{{ error }}</div>

          <div class="sign-up">
            Nếu bạn chưa có tài khoản, hãy nhấn
            <span class="btn-signup" @click="onSignup">Đăng kí</span>
            ở đây nhé.
          </div>
        </div>
      </div>
    </BModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { notify } from '@kyvg/vue3-notification'
import { BModal, BButton } from 'bootstrap-vue-next'
import { GoogleSignInButton } from 'vue3-google-signin'

import { useAuth } from '@/stores/auth'
import api from '@/api/auth'
import ModalUpdateUser from './UpdateUser.vue'

const router = useRouter()
const auth = useAuth()

const open = ref(false)
const userProps = reactive({ email: '', password: '' })
const errorEmail = ref('')
const errorPassword = ref('')
const error = ref('')
const isLoading = ref(false)
const updateUserRef = ref(null)

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function show() { open.value = true }
function hide() {
  error.value = ''
  userProps.email = ''
  userProps.password = ''
  open.value = false
}

async function onLogin() {
  errorEmail.value = ''
  errorPassword.value = ''
  error.value = ''

  if (!userProps.email || userProps.email.length > 255) {
    errorEmail.value = 'Email phải từ 1 đến 255 ký tự và không được để trống.'
    return
  }
  if (!validateEmail(userProps.email)) {
    errorEmail.value = 'Email không đúng định dạng.'
    return
  }
  if (!userProps.password || userProps.password.length < 8 || userProps.password.length > 128) {
    errorPassword.value = 'Mật khẩu phải từ 8 đến 128 ký tự và không được để trống.'
    return
  }

  if (isLoading.value) return
  isLoading.value = true
  try {
    await auth.login(userProps)
    notify({ type: 'success', text: 'Đăng nhập thành công!' })
    hide()
    const u = auth.user
    if (u?.role === 'admin') router.push({ path: '/admin' })
    else router.push({ path: '/' })
  } catch (err) {
    error.value = err?.response?.data?.error || 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin tài khoản.'
    notify({ type: 'error', text: error.value })
  } finally {
    isLoading.value = false
  }
}

async function handleLoginSuccess(response) {
  const { credential } = response || {}
  if (!credential) {
    notify({ text: 'Đăng nhập không thành công vui lòng thử lại', type: 'warn' })
    return
  }
  try {
    const { user, token, updateUser } = await api.google({ 'access-token': credential })
    auth.updateUser(user, token)
    hide()
    if (updateUser) updateUserRef.value?.show?.()
  } catch {
    notify({ text: 'Đăng nhập không thành công vui lòng thử lại', type: 'warn' })
  }
}

function handleLoginError() {
  notify({ text: 'Đăng nhập Google thất bại', type: 'error' })
}

function onSignup() { router.push({ path: '/sign-up' }); hide() }
function goToProfile() { router.push({ path: '/profile' }) }

// Cho phép parent mở/đóng modal nếu cần
defineExpose({ show, hide })
</script>

<style lang="scss">
/* giữ nguyên style của bạn */
.user-info {
  position: relative;
  display: inline-block;
  .btn-login { border: 1px solid #fff; background: transparent !important; color: #fff; padding: 0.5rem 2rem; cursor: pointer; border-radius: 5px; font-size: 16px; margin-right: 1rem; &:hover { font-weight: bold; color: #fff !important; } }
  .username { border: 1px solid #fff; color: #fff; padding: 0.5rem 2rem; cursor: pointer; border-radius: 5px; font-size: 16px; margin-right: 1rem; &:hover { font-weight: bold; } }
  .user-option { position: absolute; top: 100%; right: 0; background-color: #fff; border: 1px solid #ccc; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,.2); padding: 10px 0; min-width: 150px; visibility: hidden; opacity: 0; transform: translateY(-10px); transition: opacity .3s ease, transform .3s ease, visibility 0s; z-index: 10; pointer-events: none;
    .option { padding: 10px 15px; color: #333; cursor: pointer; text-align: left; &:hover { background-color: #f0f0f0; } }
  }
  &:hover .user-option { visibility: visible; opacity: 1; transform: translateY(0); pointer-events: all; }
}

#bv-login .modal-dialog {
  .modal-content { background: #fff; padding: 0; margin: 0; position: relative;
    .close { position: absolute; right: 20px; top: 20px; cursor: pointer; font-size: 1.5rem; }
    .login-box { padding: 50px;
      .pet-btn-primary { border-radius: 40px; background-color: rgb(243,5,96); cursor: pointer; font-size: 1rem; font-weight: 500; transition: all .4s ease; width: 100%; color: #fff; }
      .pet-btn-primary:disabled { background-color: #ccc; cursor: not-allowed; }
      .sign-up { text-align: center; font-family: "Satisfy", cursive; font-size: 17px; color: #f0288c; margin-top: 15px; .btn-signup { color: #007bff; cursor: pointer; } }
      .error { color: red; margin-top: 1rem; }
      .icon { color: #f350a1; font-family: "Lobster", cursive; font-size: 60px; }
    }
  }
}
</style>
