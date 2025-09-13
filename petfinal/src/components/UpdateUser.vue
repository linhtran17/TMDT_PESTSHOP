<!-- src/components/UpdateUser.vue -->
<template>
  <BModal v-model="open" id="bv-update-user" hide-footer hide-header size="lg">
    <div class="login-box">
      <div class="close" @click="hide">&times;</div>

      <div class="mb-3 h2">
        <div class="mb-3 d-flex justify-content-center">
          <div class="h2">Cập nhật thông tin</div>
        </div>
      </div>

      <div>
        <div>
          <label for="name" class="form-label">Tài khoản</label>
          <input
            id="name"
            type="text"
            class="form-control"
            placeholder="Nhập tên tài khoản"
            v-model="state.username"
          />
        </div>

        <div class="mt-3">
          <label for="phone" class="form-label">Số điện thoại:</label>
          <input
            id="phone"
            type="tel"
            class="form-control"
            placeholder="Nhập số điện thoại"
            v-model="state.phone"
          />
        </div>

        <div class="mt-3">
          <label for="update-email" class="form-label">Email:</label>
          <input
            id="update-email"
            type="email"
            class="form-control"
            readonly
            v-model="state.email"
          />
        </div>

        <div class="mt-3">
          <label for="address" class="form-label">Địa chỉ:</label>
          <input
            id="address"
            type="text"
            class="form-control"
            placeholder="Nhập địa chỉ"
            v-model="state.address"
          />
        </div>

        <div class="w-100 mt-3">
          <button
            class="btn btn-outline-light pet-btn-primary w-100"
            :disabled="appState.busy"
            @click="onSubmit"
          >
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  </BModal>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import { BModal } from 'bootstrap-vue-next'
import { useAuth } from '@/stores/auth'
import api from '@/api/auth'
import { AxiosError } from 'axios'

const auth = useAuth()

const open = ref(false)
const appState = reactive({ busy: false })

const state = reactive({
  email: '',
  username: '',
  phone: '',
  address: '',
})

function show() { open.value = true }
function hide() { open.value = false }

onMounted(() => {
  // fill sẵn từ user hiện tại
  const u = auth?.user || {}
  state.email = u.email || ''
  state.username = u.username || ''
  state.phone = u.phone || ''
  state.address = u.address || ''
})

// nếu user thay đổi sau này thì sync lại form
watch(
  () => auth.user,
  (u) => {
    if (!u) return
    state.email = u.email || ''
    state.username = u.username || ''
    state.phone = u.phone || ''
    state.address = u.address || ''
  },
  { deep: true }
)

async function onSubmit () {
  try {
    appState.busy = true
    const { user, token } = await api.update({ ...state })
    if (user && token) {
      auth.updateUser(user, token)
      notify({ text: 'Update successfully!', type: 'success' })
      hide()
    } else {
      notify({ text: 'Không nhận được phản hồi cập nhật.', type: 'warn' })
    }
  } catch (err) {
    const message = err instanceof AxiosError
      ? (err.response?.data?.error || 'Error!')
      : 'Error!'
    notify({ text: message, type: 'error' })
  } finally {
    appState.busy = false
  }
}

// để parent có thể gọi <UpdateUser ref="updateUserRef" /> -> .show()/.hide()
defineExpose({ show, hide })
</script>

<style lang="scss">
#bv-update-user .modal-dialog {
  .modal-content {
    background: #fff;
    padding: 0;
    margin: 0;
    position: relative;

    .close {
      position: absolute;
      right: 20px;
      top: 20px;
      cursor: pointer;
      font-size: 1.5rem;
    }

    .login-box {
      padding: 50px;

      .pet-btn-primary {
        border-radius: 40px;
        background-color: rgb(243, 5, 96);
        cursor: pointer;
        font-size: 1rem;
        font-weight: 500;
        transition: all 0.4s ease;
        width: 100%;
        color: #fff;
      }

      .error { color: red; margin-top: 1rem; }

      .icon {
        color: #f350a1;
        font-family: "Lobster", cursive;
        font-size: 60px;
      }
    }
  }
}
</style>
