<template>
  <div
    class="cart-wrap offcanvas offcanvas-end"
    :class="{ show: props.show }"
    data-bs-scroll="true"
    data-bs-backdrop="static"
    tabindex="-1"
  >
    <div class="offcanvas-header">
      <h5 class="offcanvas-title">Thông tin đơn hàng</h5>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
        @click="$emit('onClose')"
      ></button>
    </div>
    <div class="offcanvas-body">
      <Loading v-if="props.busy"></Loading>
      <template v-else>
        <!-- Customer Info -->
        <div class="order-info">
          <div>
            <div>Họ và tên:</div>
            <div class="pl-3">{{ props.order?.fullname }}</div>
          </div>
          <div>
            <div>Số điện thoại:</div>
            <div>{{ props.order?.phone }}</div>
          </div>
          <div>
            <div>Email:</div>
            <div>{{ props.order?.fullname }}</div>
          </div>
          <div>
            <div>Địa chỉ:</div>
            <div>{{ props.order?.deliveryAddress }}</div>
          </div>
          <div>
            <div>Ghi chú:</div>
            <div>{{ props.order?.note }}</div>
          </div>
          <div>
            <div>Trạng thái đơn hàng:</div>
            <!-- <div class="shadow status text-light" :class="props.order?.status">
              {{ statusToTitle[props.order?.status] || "" }}
            </div> -->
            <div>
              <select
                class="form-select"
                name="cat_pet"
                required
                aria-label="Status"
                v-model="props.order.status"
                @change="onChangeOption"
              >
                <option
                  v-for="op in statusOptions"
                  :key="`op-${op.value}`"
                  :value="op.value"
                >
                  {{ op.name }}
                </option>
              </select>
            </div>
          </div>
          <div>
            <div>Hình thức thanh toán:</div>
            <div>
              <span v-if="props.order?.pay === 'PAY'">
                Chuyển khoản
                <img
                  src="/src/assets/icons/debit-card.png"
                  alt="Chuyển khoản"
                  style="width: 20px; height: 20px; margin-left: 5px"
                />
              </span>
              <span v-else>
                Thanh toán khi nhận hàng
                <img
                  src="/src/assets/icons/payment.png"
                  alt="Thanh toán khi nhận hàng"
                  style="width: 20px; height: 20px; margin-left: 5px"
                />
              </span>
            </div>
          </div>

          <div>
            <div>Trạng thái thanh toán:</div>
            <div>
              <span
                :class="{
                  'text-success fw-bold': props.order?.payStatus === '00',
                  'text-danger fw-bold': props.order?.payStatus !== '00',
                }"
              >
                {{
                  props.order?.payStatus === "00"
                    ? "Đã thanh toán"
                    : "Đã thanh toán"
                }}
              </span>
            </div>
          </div>
        </div>

        <!-- Cart list -->
        <div>
          <table
            class="table table-hover table-striped table-responsive caption-top"
          >
            <caption class="fw-bold mt-2">
              Danh sách sản phẩm
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
              <tr v-for="(item, inx) in props.order?.products">
                <td>{{ inx + 1 }}</td>
                <td>{{ item?.name }}</td>
                <td class="text-center">
                  <span class="fw-bold">{{ item?.quantity }}</span>
                </td>
                <td class="text-center">
                  <span v-if="item?.discount"
                    >{{ item?.discount }}% ({{
                      formatCurrency(
                        (item?.discount * item.quantity * item.price) / 100
                      )
                    }})</span
                  >
                </td>
                <td class="text-end">{{ formatCurrency(item?.price) }}</td>
                <td class="text-end">
                  {{
                    formatCurrency(
                      item?.price * item.quantity -
                        (item?.discount * item.quantity * item.price) / 100
                    )
                  }}
                </td>
              </tr>
              <tr>
                <td colspan="5" class="text-end fw-bold">Tổng tạm tính:</td>
                <td class="text-end fw-bold">
                  {{ formatCurrency(props.order?.tmpTotal) }}
                </td>
              </tr>
              <tr>
                <td colspan="5" class="text-end fw-bold">Giảm giá:</td>
                <td class="text-end fw-bold">
                  {{ formatCurrency(props.order?.discountTotal) }}
                </td>
              </tr>
              <tr>
                <td colspan="5" class="text-end fw-bold">Thành tiền:</td>
                <td class="text-end text-danger fw-bold">
                  {{ formatCurrency(props.order?.total) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- actions -->
        <div class="mt-3 d-flex confirm-wrap">
          <button
            class="btn btn-outline-secondary w-100 mr-1"
            @click="$emit('onClose')"
          >
            Đóng
          </button>
          <button class="btn btn-danger w-100 ml-1" @click="onConfirm">
            Lưu
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { defineProps, reactive } from "vue";
import dashboardApi from "@/api/dashboard.api";
import { notify } from "@kyvg/vue3-notification";
import Loading from "@/components/Loading.vue";
import { statusOptions } from "@/utils";

const props = defineProps(["show", "order", "busy"]);
const $emit = defineEmits(["onClose", "onSave"]);

const state = reactive({ busy: false });

async function onConfirm() {
  const { id, status } = props.order;
  state.busy = true;
  try {
    const data = await dashboardApi.update(id, { status });
    if (data.status) {
      notify({
        title: "Thông báo",
        text: "Thao tác thành công!",
        type: "success",
      });
      $emit("onSave");
    } else {
      notify({
        title: "Thông báo",
        text: "Đã có lỗi xảy ra vui lòng thử lại",
        type: "warn",
      });
    }
  } catch (error) {
    notify({
      title: "Thông báo",
      text: "Đã có lỗi xảy ra vui lòng thử lại",
      type: "warn",
    });
  } finally {
    state.busy = false;
  }
}
</script>
<style lang="scss">
.cart-wrap {
  .confirm-wrap {
    gap: 16px;
  }

  .order-info {
    border-bottom: 1px solid #ccc;
    padding-bottom: 0.5rem;
    div {
      display: flex;
      margin-bottom: 0.25rem;
      gap: 0.5rem;
      justify-content: flex-start;
      align-items: center;
      div {
        &:first-child {
          font-weight: bold;
        }
        &:nth-child(2) {
          &.status {
            padding: 0.25rem 1rem;
            border-radius: 0.5rem;
            &.created {
              background: #0dcaf0;
            }
          }
        }
      }
    }
  }
}
.text-success {
  color: green;
}
.text-danger {
  color: red;
}

</style>