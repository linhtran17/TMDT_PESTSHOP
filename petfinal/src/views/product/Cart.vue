<template>
  <div
    class="cart-wrap offcanvas offcanvas-end"
    :class="{ show: props.show }"
    data-bs-scroll="true"
    data-bs-backdrop="static"
    tabindex="-1"
  >
    <div class="offcanvas-header">
      <h5 class="offcanvas-title">{{ state[state.step] }}</h5>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
        @click="$emit('onClose')"
      ></button>
    </div>

    <div class="offcanvas-body">
      <!-- Thông tin khách hàng -->
      <div v-if="state.step === 1 || state.step === 2">
        <div>
          <label for="cart-name" class="form-label">Họ và tên</label>
          <input
            :disabled="state.step === 2"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors.fullname }"
            id="cart-name"
            placeholder="Nhập tên nhận hàng"
            v-model="state.fullname"
          />
          <div v-if="errors.fullname" class="invalid-feedback">
            {{ errors.fullname }}
          </div>
        </div>

        <div class="mt-3">
          <label for="cart-phone" class="form-label">Số điện thoại:</label>
          <input
            type="tel"
            :disabled="state.step === 2"
            class="form-control"
            :class="{ 'is-invalid': errors.phone }"
            id="cart-phone"
            placeholder="Nhập số điện thoại nhận hàng"
            v-model="state.phone"
          />
          <div v-if="errors.phone" class="invalid-feedback">
            {{ errors.phone }}
          </div>
        </div>

        <div class="mt-3">
          <label for="cart-email" class="form-label">Email:</label>
          <input
            type="email"
            :disabled="state.step === 2"
            class="form-control"
            :class="{ 'is-invalid': errors.email }"
            id="cart-email"
            placeholder="Nhập email nhận hàng"
            v-model="state.email"
          />
          <div v-if="errors.email" class="invalid-feedback">
            {{ errors.email }}
          </div>
        </div>

        <div class="mt-3">
          <label for="cart-address" class="form-label">Địa chỉ:</label>
          <input
            type="text"
            :disabled="state.step === 2"
            class="form-control"
            :class="{ 'is-invalid': errors.deliveryAddress }"
            id="cart-address"
            placeholder="Nhập địa chỉ nhận hàng"
            v-model="state.deliveryAddress"
          />
          <div v-if="errors.deliveryAddress" class="invalid-feedback">
            {{ errors.deliveryAddress }}
          </div>
        </div>

        <div class="mt-3">
          <label for="cart-note" class="form-label">Ghi chú:</label>
          <textarea
            :disabled="state.step === 2"
            class="form-control"
            :class="{ 'is-invalid': errors.note }"
            id="cart-note"
            placeholder="Nhập ghi chú cho đơn hàng"
            v-model="state.note"
            rows="3"
          ></textarea>
          <div v-if="errors.note" class="invalid-feedback">
            {{ errors.note }}
          </div>
        </div>

        <div class="mt-3" v-if="state.step === 2">
          <label class="form-label">Phương thức thanh toán:</label>

          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              id="cashPayment"
              value=""
              v-model="state.pay"
            />
            <label class="form-check-label" for="cashPayment">
              Thanh toán khi nhận hàng
            </label>
          </div>

          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              id="bankTransfer"
              value="PAY"
              v-model="state.pay"
            />
            <label class="form-check-label" for="bankTransfer">
              Chuyển khoản
            </label>
          </div>
        </div>

        <div v-if="state.pay === 'PAY'" class="mt-2">
          <BFormGroup label="Vui lòng lựa chọn phương thức thanh toán">
            <BFormRadioGroup
              id="radio-group-bank"
              v-model="state.bankCode"
              :options="banks"
              name="bank-options"
              stacked
            />
          </BFormGroup>
        </div>

        <div class="mt-3 d-flex confirm-wrap" v-if="state.step === 1">
          <button class="btn btn-outline-secondary w-100 mr-1" @click="state.step = 0">
            Quay lại
          </button>
          <button class="btn btn-danger w-100 ml-1" @click="validateStep1()">
            Mua hàng
          </button>
        </div>
      </div>

      <!-- Danh sách giỏ hàng -->
      <div v-if="state.step === 0 || state.step === 2">
        <table class="table table-hover table-striped table-responsive caption-top">
          <caption v-if="state.step === 2" class="fw-bold mt-3">
            <h4 class="fw-300">Danh sách sản phẩm</h4>
          </caption>
          <thead>
            <tr>
              <th class="fw-bold">ID</th>
              <th class="fw-bold">Tên</th>
              <th class="text-center fw-bold">Số lượng</th>
              <th class="text-center fw-bold">Giảm giá</th>
              <th class="text-end fw-bold">Giá</th>
              <th class="text-end fw-bold">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, inx) in cartStore.products" :key="`products-${inx}`">
              <td>{{ inx + 1 }}</td>
              <td>{{ item?.name }}</td>
              <td class="text-center">
                <div class="quanlity-wrap">
                  <button class="btn btn-outline-info btn-sm" @click="cartStore.updateQuantity(item.id, -1)">-</button>
                  <span class="fw-bold">{{ item?.quantity }}</span>
                  <button class="btn btn-outline-info btn-sm" @click="cartStore.updateQuantity(item.id, 1)">+</button>
                </div>
              </td>
              <td class="text-center">
                <span v-if="item?.discount">
                  {{ item?.discount }}%
                  ({{ formatCurrency((item?.discount * item.quantity * item.price) / 100) }})
                </span>
              </td>
              <td class="text-end">{{ formatCurrency(item?.price) }}</td>
              <td class="text-end">
                {{
                  formatCurrency(
                    item?.price * item.quantity - (item?.discount * item.quantity * item.price) / 100
                  )
                }}
              </td>
            </tr>
            <tr>
              <td colspan="5" class="text-end fw-bold">Tổng tạm tính:</td>
              <td class="text-end fw-bold">{{ formatCurrency(cartStore.totalPrice) }}</td>
            </tr>
            <tr>
              <td colspan="5" class="text-end fw-bold">Giảm giá:</td>
              <td class="text-end fw-bold">{{ formatCurrency(cartStore.totalDiscount) }}</td>
            </tr>
            <tr>
              <td colspan="5" class="text-end fw-bold">Thành tiền:</td>
              <td class="text-end text-danger fw-bold">
                {{ formatCurrency(cartStore.totalPrice - cartStore.totalDiscount) }}
              </td>
            </tr>
          </tbody>
        </table>

        <div class="mt-3 d-flex confirm-wrap" v-if="state.step === 0">
          <button class="btn btn-outline-secondary w-100 mr-1" @click="$emit('onClose')">Đóng</button>
          <button class="btn btn-danger w-100 ml-1" @click="state.step = 1">Mua hàng</button>
        </div>
      </div>

      <div class="mt-3 d-flex confirm-wrap" v-if="state.step === 2">
        <button class="btn btn-outline-secondary w-100 mr-1" @click="state.step = 1">Quay lại</button>
        <button class="btn btn-danger w-100 ml-1" @click="onConfirm" :disabled="isConfirming">
          {{ isConfirming ? 'Đang xử lý...' : 'Xác nhận' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { notify } from '@kyvg/vue3-notification'
import { BFormGroup, BFormRadioGroup } from 'bootstrap-vue-next'

import { useCart } from '@/stores/cart'
import { useAuth } from '@/stores/auth'
import orderApi from '@/api/orders'

const props = defineProps(['show'])
const emit = defineEmits(['onClose'])

const cartStore = useCart()
const storeAuth = useAuth()
const router = useRouter()
const isConfirming = ref(false)

// Options cho radio group ngân hàng
const banks = [
  { text: 'ATM - Ngân hàng nội địa', value: 'VNBANK' },
  { text: 'Thẻ quốc tế', value: 'INTCARD' }
]

const state = reactive({
  step: 0,
  0: 'Đơn hàng',
  1: 'Thông tin nhận hàng',
  2: 'Thông tin đơn hàng',
  fullname: storeAuth.user?.username || '',
  deliveryAddress: storeAuth.user?.address || '',
  phone: storeAuth.user?.phone || '',
  email: storeAuth.user?.email || '',
  note: '',
  username: storeAuth.user?.username || '',
  pay: '',
  bankCode: 'VNBANK'
})

const errors = reactive({
  fullname: '',
  phone: '',
  email: '',
  deliveryAddress: '',
  note: ''
})

onMounted(() => {
  state.fullname = storeAuth.user?.username || ''
  state.deliveryAddress = storeAuth.user?.address || ''
  state.phone = storeAuth.user?.phone || ''
  state.email = storeAuth.user?.email || ''
  state.username = storeAuth.user?.username || ''
})

function validateStep1 () {
  errors.fullname = ''
  errors.phone = ''
  errors.email = ''
  errors.deliveryAddress = ''
  errors.note = ''

  let isValid = true

  if (!state.fullname) { errors.fullname = 'Tên không được bỏ trống'; isValid = false }
  else if (state.fullname.length > 255) { errors.fullname = 'Tên không được quá 255 kí tự'; isValid = false }
  else if (/[^a-zA-Z\sÀ-ỹ]/.test(state.fullname)) { errors.fullname = 'Tên không được chứa ký tự đặc biệt'; isValid = false }

  if (!state.phone) { errors.phone = 'Vui lòng nhập số điện thoại'; isValid = false }
  else if (!/^\d{10}$/.test(state.phone)) { errors.phone = 'Số điện thoại phải có 10 chữ số'; isValid = false }

  if (!state.email) { errors.email = 'Vui lòng nhập email'; isValid = false }
  else if (state.email.length > 100) { errors.email = 'Email không được vượt quá 100 ký tự'; isValid = false }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) { errors.email = 'Email không hợp lệ'; isValid = false }

  if (!state.deliveryAddress) { errors.deliveryAddress = 'Vui lòng nhập địa chỉ'; isValid = false }
  else if (state.deliveryAddress.length > 200) { errors.deliveryAddress = 'Địa chỉ không vượt quá 200 kí tự'; isValid = false }

  if (state.note && state.note.length > 255) { errors.note = 'Ghi chú không được quá 255 kí tự'; isValid = false }

  if (isValid) state.step = 2
}

async function onConfirm () {
  if (!storeAuth.isAuthenticated) {
    notify({ type: 'warn', text: 'Vui lòng đăng nhập để đặt hàng!' })
    router.push({ path: '/login' })
    return
  }

  if (isConfirming.value) return
  isConfirming.value = true

  try {
    const { fullname, deliveryAddress, phone, email, note, username } = state

    const products = cartStore.products.map(({ discount, price, quantity, id, note }) => ({
      discount, price, quantity, id, note
    }))

    const data = await orderApi.add({
      fullname,
      username: username || '',
      deliveryAddress,
      phone,
      email,
      note,
      products,
      pay: { pay: state.pay, bankCode: state.bankCode }
    })

    if (data?.status) {
      state.step = 0
      notify({ title: 'Đặt hàng thành công', text: 'Bạn đã đặt hàng thành công. Cảm ơn bạn đã mua hàng', type: 'success' })
      cartStore.confirm()
      if (data.link) window.open(data.link, '_blank')
      emit('onClose')
    } else {
      notify({ title: 'Đặt hàng không thành công', text: 'Đặt hàng không thành công. Vui lòng kiểm tra lại đơn hàng!', type: 'warning' })
    }
  } catch (error) {
    notify({ type: 'error', text: error?.response?.data?.error || 'Lỗi khi đặt hàng.' })
    if (error?.response?.status === 401) {
      storeAuth.logout()
      router.push({ path: '/login' })
    }
  } finally {
    isConfirming.value = false
  }
}

function formatCurrency (value) {
  return new Intl.NumberFormat('vi-VN').format(Number(value || 0))
}
</script>

<style lang="scss">
.cart-wrap {
  .confirm-wrap { gap: 16px; }
  .quanlity-wrap {
    display: flex; gap: .5rem; align-items: center; justify-items: center; align-content: center;
  }
}
</style>
